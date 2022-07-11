---
title: Recording Usage
order: 4
---

<!-- include _pieces/usage-intro -->

## Counters

Tier of course has no idea what your actual features are,
_really_. You could be shipping stamps, serving files, washing
cars, anything.

Tier is, at its core, a series of timers and counters that your
app uses to track the usage of whatever it is your app does.

Internally, there is a _positive_ counter, and a _negative_
counter, so that Tier can track each usage increase _and
decrease_ over time.

## Overages

When usage puts an org beyond the last tier in their plan for
that feature, they go into an "overage" state.

Overages are not billed, but they _are_ recorded.

If a feature isn't delivered, you can `tier.record()` with a
negative number to roll it back.

## Timing

Usage is counted against the phase in the [org
schedule](/content/concepts/orgs.md) corresponding to their
effective date.

This "tallying up" of usage occurs at the _end_ of the billing
phase. Note that `record()` and `appendPhase()` both take a Date
argument indicating when they are effective. (In both cases, the
effective date defaults to "right now".)

## More Usage Examples

See the [SDK documentation](/content/node-sdk.md) for more
examples of using the Tier client to decide who gets access to
your app's features.
