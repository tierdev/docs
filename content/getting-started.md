---
title: Getting Started with Tier
---

This guide covers getting started with Tier so that you can
quickly monetize your SaaS product without regretting it later.

For a deeper dive into the concepts Tier uses, see [Tier Basic
Concepts](../basics).

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
supported SDKs.  However, the [API](../api) is also fairly small
by design, and it's perfectly acceptable to interface with it
that way as well.

[SDKs](../sdk) are provided for the following languages.  If your
preferred language isn't shown here, let us know!

* [Node.js](https://github.com/tierdev/node-sdk)
* [Go](https://github.com/tierdev/go-sdk) <!-- TKTK -->

## Log into Tier

You can log into Tier with the SDK by running `tier login` in
your terminal in your project directory.  This will open a web
browser and mint a token that will be used by that project.

Another option is to mint a token manually by going to
<https://app.tier.run/tokens>.  This is useful for providing the
Tier API token to your production application environment,
configuration files, and so on.

## Define and Push a Pricing Model

The [pricing model](../basics#model) is a JSON representation of
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
