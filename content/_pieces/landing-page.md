Tier is a pricing model system that reduces the effort and risks
of managing your application's pricing and packaging.

Much more information is available in [the docs](/docs), but
these steps will get you started.

## Setting Up Tier

Get [the Node.js
SDK](https://www.npmjs.com/package/@tier.run/sdk) by running:

```bash
npm install @tier.run/sdk
```

This will give you a `tier` command line client, and the SDK that
you can use in your application.

## Get an API Token

Head over to [/tokens](/tokens) to mint a token for your
production environment, or use the `tier login` command
to authorize your project locally.

## Link Stripe to Your Tier Account

Go to the [Account](/account) page to do this.  (This is how you
get invoices flowing so you collect money.)

## Push a Pricing Model

Create a `pricing.json` file that reflects your plans, features,
and prices.  Read the [Tier Basic Concepts](/docs/basics) guide
to learn what needs to go in this file.

If you don't get it exactly right, don't worry.  The whole point
is that you can push new versions of plans whenever you like.

When you're ready to push it live, run:

```bash
tier push pricing.json
```

You'll see the current model on the [Model](/model) page here, or
any time by running `tier pull` on the command line or
`tier.pullModel()` from the SDK.

## Integrate With Tier

At this point, you have a working account and can access the Tier
API, so the real fun starts.  There are three main steps to
getting Tier into your app.

1. Signing up new orgs.
2. Collecting payment information.
3. Recording usage within your application.

To load the Tier client in your application:

```js
import {TierClient} from '@tier.run/sdk'
// or, if you prefer commonjs:
// const {TierClient} = require('@tier.run/sdk')
// pick up the token and any other settings from your environment
const tier = TierClient.fromEnv()
```

## On Sign Up: `appendPhase`

This method _appends_ a new _phase_ to the org's schedule.

```js
await tier.appendPhase(`org:${my_unique_user_id}`, `plan:plan_name@version`)
```

This puts the org on a plan, creating them in the system if they
don't already exist.

## Whenever The User Does Anything

To record usage, we reserve the use of a feature.  A reservation
can be canceled (for example, if the thing they were trying to do
failed), but otherwise, that counts towards their usage for the
current phase.

```js
const res = await tier.reserve(`org:${user_id}`, 'feature:thing')
```

If the thing fails, you can call `await res.refund()` and it'll
be nullified.

You can also pass a number of units to `tier.reserve()`, for
example if the thing they're doing has some value other than `1`:

```js
// user is about to download 123 bytes of things, so charge them for that
const res = await tier.reserve(`org:${user_id}`, 'feature:thing', 123)
```

If the user is over their limit, then the reservation attempt
will show you that:

```js
const res = await tier.reserve(`org:${user_id}`, 'feature:thing')
if (!res.ok) {
  // went over their limit!
  // show an error page, let it ride, up to you
}
```

## Collect Payment Info

Add the `tier.js` browser client to every page on your site.
This loads Stripe properly, which ensures that you benefit from
their bot detection magic.

```html
<script src="https://app.tier.run/tier.js"></script>
```

Then, on the server, get a `StripeOptions` object with the Tier
SDK:

```js
const stripeOptions = await tier.stripeOptions(`org:${org_id}`)
```

And pass that to the front-end to load the payment entry form:

```html
<form id="payment-form">
  <div id="payment-element"></div>
  <button type="submit">
    Submit
  </button>
  <div id="payment-error"></div>
</form>

<script>
// use the Tier browser client to do the browser bits
Tier.paymentForm(<%- JSON.stringify(stripeOptions) %>, {
  form: '#payment-form',
  payment: '#payment-element',
  error: '#payment-error',
})
</script>
```

When Stripe redirects them back to your site, finish the process
by calling `tier.stripeSetup(org, setup_intent)`.

```js
await tier.stripeSetup(`org:${org}`, searchParams.get('setup_intent'))
```

If this raises an error, you can show that to the user, or
redirect them to the `er.redirect_to_url.url` if it's set.
(Usually this means that the user has to authorize something, or
their card was denied, or some other problem.)

## Iterating on Pricing Plans

If you ever want to add a new plan, just edit the `pricing.json`
file to add a new version of a plan, and push it live.

Anyone on the old plans will keep on with their existing plan
unless you explicitly call `tier.appendPhase()` at some point to
upgrade them to the new version.  All your `tier.reserve()` calls
can stay just as they are.

Safe, zero-refactoring pricing iteration.

## We're here to help

We want you to be successful with this!

[Get in
touch](https://join.slack.com/t/tier-uo72534/shared_invite/zt-1b7iqereo-G2GAIenFHnpi7HX2FmUX6A)
and let us know where you're getting stuck.

Or if you're not getting stuck, then just come brag about it.
