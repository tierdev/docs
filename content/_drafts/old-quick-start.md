
## Sign Up for Tier

Create an account at <https://app.tier.run> using your GitHub or
Google account.

Tier will automatically create team accounts for your authorized
GitHub or Google organizations, as well as a "solo org" for your
individual account.

### Set up Stripe Account and Payment Details

Go to <https://app.tier.run/account> to set up your Stripe
account details and enter the payment information for your
organization.  You _can_ skip this step and start using Tier
immediately, but you can't bill customers or actually get paid
until you've connected Stripe.

## Install a Tier SDK

The easiest way to interact with Tier is by using one of our
supported SDKs.  However, the API is also fairly small
by design, and it's perfectly acceptable to interface with it
directly.

SDKs are provided for the following languages.  If your
preferred language isn't shown here, let us know!

* [Node.js](./node-sdk.md)
<!-- TKTK * [Go](https://github.com/tierdev/go-sdk) -->

## Log into Tier

You can log into Tier with the SDK by running `tier login` in
your terminal in your project directory.  This will open a web
browser and mint a token that will be used by that project.

Another option is to mint a token manually by going to
<https://app.tier.run/tokens>.  This is useful for providing the
Tier API token to your production application environment,
configuration files, and so on.

## Define and Push a Pricing Model

The [pricing model](basics#model) is a JSON representation of
the plans, features, and tiers that define how users are charged
for your product.

Write a `pricing.json` file with an initial set of plans and
feature definitions, and push it live by running `tier push
pricing.json`.

It doesn't have to be perfect, since you can update plans at any
time (that's the whole point!) but it should ideally reflect your
current pricing model as closely as possible.

You can view the current model in Tier at any time by running
`tier pull`.

## Put Customers on a Plan

In your application, any time you create a new user, call the
`tier.appendPhase(org, plan)` method to put them on a plan.  This
defines the customer in Tier.

You can use any identifier to reference a customer, as long as it
is consistent.  When sending the org id to Tier, prefix it with
the string `"org:"`.

```js
await tier.appendPhase(`org:${some_unique_user_id}`, 'plan:plan_name@version')
```

### Collect Customer Payment Info

In the server-side portion of your application somewhere (for
example, on a users billing settings page, or wherever you want
them to enter payment information), use the `tier.stripeOptions`
method to get the appropriate configuration to pass to the client
side.

```js
const stripeOptions = await tier.stripeOptions(`org:${some_unique_user_id}`)
```

Then pass this options object to the client-side to use with the
`tier.js` client SDK.

Include `<script src="https://app.tier.run/tier.js"></script>` on
every page of your site.  This ensures that Stripe is properly
loaded, and will optimally track bots and other kinds of bad
behavior.

To mount the payment methods form, use the `Tier.paymentForm()`
method.  The example below is shown using EJS, but of course
however you pass data to your templates will work fine:

```html
<form id="payment-form">
  <div id="payment-element"></div>
  <button type="submit" className={className}>
    Submit
  </button>
  <div id="payment-error"></div>
</form>

<script>
Tier.paymentForm(<%- JSON.stringify(stripeOptions) %>, {
  form: '#payment-form',
  payment: '#payment-element',
  error: '#payment-error',
})
</script>
```

Or, as a React component:

```js
// react example
import { useEffect } from 'react'
export default function PaymentMethodForm({ stripeOptions }) {
  useEffect(() => {
    const elements = {
      form: '#payment-form',
      payment: '#payment-element',
      error: '#payment-error',
    }
    const load = () => Tier.paymentForm(stripeOptions, elements)
    if (window.Tier) load()
    else window.addEventListener('DOMContentLoaded', load)
  }, [stripeOptions])

  return (
    <>
      <form id="payment-form">
        <div id="payment-element"></div>
        <input type="submit" value="Submit" className={className} />
        <div id="payment-error"></div>
      </form>
    </>
  )
}
```

## Attaching Payment Info to Customer

When the user submits the Payment Method form, their information
will be sent to Stripe, and they'll be directed back to this
page, but with a special `?setup_intent=...` on the query string.

To be able to actually bill the customer, we'll have to attach
this payment method to their account.

In some cases, additional verification may be required, which is
why this extra step exists.

Do this by using the `tier.stripeSetup(org, setupIntent)` method.

```js
import { isTierError, TierClient } from '@tier.run/sdk'
const tier = TierClient.fromEnv()

// account settings page
app.get('/account', async (req, res) => {
  const org = await lookupCurrentLoggedInUserSomehow(req)

  // Many frameworks present an easier way to get at
  // query string parameters, of course. However you
  // normally do it is fine.
  const u = new URL(req.url, 'http://x')
  if (u.searchParams.has('setup_intent')) {
    // returning from Stripe payment method setup.
    try {
      await tier.stripeSetup(`org:${org}`, u.searchParams.get('setup_intent'))
      // payment method is now attached!
    } catch (er) {
      if (isTierError(er)) {
        // something bad happened!
        // handle this like any other server error,
        // log it, show error page, etc.
        return serve5xxStatusPage(res, er)
      } else if (er.next_action?.redirect_to_url?.url) {
        // Redirect the user to go authorize their payment
        return redirect(res, er.redirect_to_url.url, 303)
      } else if (er.status === 'processing') {
        // all we can do is wait
        return showAccountSetupPage(res, {
          message: 'Still processing your payment method',
        })
      } else {
        // some other error
        // See https://stripe.com/docs/api/setup_intents/object
        // for descriptions of the values set on er.status and
        // er.last_setup_error to decide how best to tell the
        // user what to do.
        return showAccountSetupPage(res, {
          message: constructPaymentMethodSetupErrorMessage(er),
        })
      }
    }
  }

  const stripeOptions = await tier.stripeOptions(`org:${org}`)
  showAccountSetupPage(res)
})
```

Once the payment method is attached to the customer successfully,
any usage that is reported to Tier will automatically be invoiced
using the payment method that they have entered.
