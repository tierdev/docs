---
title: Model
order: 1
---

<!-- include _pieces/model-intro -->

## Plans

<!-- include _pieces/plan-intro -->

## Append-Only

The goal of Tier is to enable iteration on your pricing
structure, in a way that is easy, reliable, and _safe_.

One of the hardest pieces of any pricing change in a SaaS product
is dealing with users who signed up for legacy pricing plans.  If
their price goes up, you may need to apply discounts to all
legacy users to keep them happy, or add custom logic throughout
your application to continue to give them access to features
they've paid for.

If a certain user negotiates a special price for some reason
(special volume discounts for large enterprise customers, for
example), then this gets even more complicated, and the risk of
losing the customer can be even greater.

Each plan in the Tier model has a name and a version.
In order to prevent _changing_ the behavior of an existing
user's plan, Tier will not allow you to modify a plan version
once it exists.  However, if you add a new version of a plan,
then that can become the default for new users signing up for
your service.

## Features

<!-- include _pieces/feature-intro -->

The value of a `feature` object in the model can have the
following fields:

* `title` Optional.  A human-readable description of the feature,
  for use on invoices and wherever else you might like to show
  it.  This should be something that is more understandable to
  your customers than the arbitrary `feature:...` string you use
  internally.
* `type` Optional.  Can be either `"graduated"` or `"volume"`.
  Different features within your model can have different
  `"type"` values.
    * `"graduated"` Default.  The net price is determined by
      summing up the usage in each tier according to the price
      for that tier.
    * `"volume"` The net price is determined by charging for _all_
      usage in the billing period at the final tier that the user
      ends up in.
* `tiers` Required.  An array of `tier` objects representing the
  usage tiers of this feature.

## Tiers

<!-- include _pieces/feature-tier-intro -->

## Pushing a Model

<!-- include _pieces/pushing-a-model -->
