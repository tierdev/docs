---
title: Reservations
---

<!-- include _pieces/reservation-intro -->

## Counters

Tier of course has no idea what your actual features are,
_really_.  You could be shipping stamps, serving files, washing
cars, anything.

Tier is, at its core, a series of timers and counters that your
app uses to track the usage of whatever it is your app does.

Internally, there is a _positive_ counter, and a _negative_
counter, so that Tier can track each reservation _and each
refund_ over time.

## Overages

When a reservation puts an org's usage of a feature beyond the
last tier in their plan, they go into an "overage" state.

Overages are not billed, but they _are_ recorded.

If the reservation is refunded using the `res.refund()` method,
then a negative counter is applied to zero out the previous
reservation.

## Timing

Reservations are counted against the phase in the [org
schedule](/content/concepts/3-orgs.md) corresponding to their
effective date.

This "tallying up" of usage occurs at the _end_ of the billing
phase.  Note that `reserve()` and `appendPhase()` both take a
Date argument indicating when they are effective.  (In both
cases, the effective date defaults to "right now".)

So, you can do the following:

- Attempt to reserve some feature usage, get told that it will
  put the user in an overage state.
- Let the user opt-in to upgrading their plan, and backdate that
  `appendPhase()` to 1 second before the overage reservation.
- Deliver the feature, and the user will be billed for it at
  their new plan level, even though the reservation was recorded
  _before_ they signed up for the new plan.

## More Usage Examples

See the [SDK documentation](/content/node-sdk.md) for more
examples of using `tier.reserve()` and reservation objects to
decide who gets access to your app's features.
