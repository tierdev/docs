---
title: Pricing Pages
order: 2
---

_Note: this feature is experimental, and under active
development!  Please try it out, but expect changes and [give us
feedback](/slack) about what works for you, what you'd like to
see, etc._

As you define plans in your [pricing
model](/content/concepts/1-model.md), of course it does not make
things much easier unless the users in your application can be
signed up for the latest and greatest versions of each plan.

Your app needs a way to programmatically get the list of plans
that should be shown to users, so that the registration flow can
be driven entirely by your pricing model definition, rather than
hard-coded plan names.

This is where [Pricing Pages](/pricing-page) come in.

## Pricing Page Data Model

The Pricing Page is a subset of the plans defined in your
[model](/content/conepts/1-model.md).

Each pricing page data object contains the following fields:

* `name` The name of this pricing page.  The default pricing page
  is named `"default"`.
* `signupURL` Optional.  The URL where users can sign up for
  these plans.  (The default pricing page does not have a
  `signupURL`.)
* `plans` Array of plan objects, each including an `id` (the
  full `plan:name@version`), `name` (the `"plan:name"` part of
  the plan identifier), and `version` (the `"version"` part of
  the plan identifier that comes after the `"@"`.)  The default
  pricing page contains the last version of each plan name,
  lexically sorted.

## Fetching a Pricing Page

You can fetch a pricing page by using the [Tier
SDK](/content/node-sdk.md), or making a request to
`https://app.tier.run/web/pricing-page/-/${name}`.  (Omit the
`${name}` for the default pricing page.)

## Turning Pricing Page into HTML

The data provided by Tier can be transformed into HTML using your
templating language of choice, however your application does such
things.

See the
[tier-node-demo](https://github.com/tierdev/tier-node-demo/blob/main/lib/templates/pricing.ejs)
for an example of this.

## Signing Up New Users, Adjusting Plans, etc.

If you use the Tier pricing page as your source of available
plans, then you can easily pass the selected plan name to your
application logic.

There, your application can call `tier.appendPhase(org, plan)`
without having to hard-code anything.

The result is fully data-driven pricing plan management, where
any change to your model will update the options presented to a
user, _without_ additional code changes.
