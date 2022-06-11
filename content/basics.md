---
title: Tier Basic Concepts
---

This guide covers the basic concepts that Tier uses.  If you're
just getting started with Tier, and want to skip all this, check
out the [Getting Started with Tier](getting-started) guide as
well.

## Table of Contents

## Orgs

Every customer of your application is identified to tier by a
string starting with `'org:'`. The rest of the string can
contain any arbitrary identifier that you use internally to
reference the customer.

These are all valid `OrgName` values:

- `org:user@example.com`
- `org:github:tierdev`
- `org:google:customer-domain.com`
- `org:b04b5fb0-2224-4cdd-aa2d-d03db1441fa5`
- `org:7`

The important thing is that _you_ can link the org to an actual
user within your app, so that you always send the same `OrgName`
for the same actual customer.

## Features

Every feature in your application is identified with a string
starting with `feature:`. The rest of the string can contain any
arbitrary identifier that you use internally to reference a
feature. You can think of this as a feature flag for restricting
usage to paid features and tracking how much of something a
customer has consumed.

The feature name should identify what thing the user is trying to
do or consume, which you might bill for (or at least track). For
example:

- `feature:send-message`
- `feature:files-stored`
- `feature:bandwidth-gb`
- `feature:generate-pdf`
- `feature:read-only-seat`
- `feature:requests`

### Tiers

A feature has a set of "tiers", which define the prices and
limits for use of that feature. Each tier has the following
fields:

- `upto` The upper limit of the current tier. If not specified,
  then the tier is unbounded.
- `base` The price that a user is charged immediately when
  reaching this tier of usage. Defaults to `0`.
- `price` The price per unit of consumption within this tier.

The simplest "free, unlimited" tier is `{}`. Since it doesn't
specify anything, it uses the defaults: up to Infinity, $0.00 per
unit, $0.00 base price.

For example, if we want to say that streaming a song on our
platform costs $1 each for the first 100, and then $0.50
thereafter, we could do:

```json
{
  "feature:song-stream": {
    "tiers": [{ "price": 100, "upto": 100 }, { "price": 50 }]
  }
}
```

## Plan

Every billing plan that a user might be signed up for is
identified with a string starting with `'plan:'`, and containing
a `@`. The part before the `@` is the "name". The part after
the `@` is the "version".

- `plan:free@2`
- `plan:pro@13`
- `plan:enterprise@custom-for-acme-signed-2022-05-13`
- `plan:pro@trial-23`
- `plan:basic@beta-user-discount-25`

You can define as many versions of as many plans as you want in
your pricing model. However, you may _not_ change a given
version of a plan, so to make changes you have to create a new
version of it. This makes it possible to experiment _safely_
with pricing changes, and only update new customers' plans when
it makes sense for your application.

Think of your set of plans as an append-only log of the various
ways you try to package your application and bill your customers.

## Schedules and Phases

Each org can be put on a given `plan:<name>@<version>` by calling
`tier.appendPhase(org, plan)`. This appends a new _phase_ to
their billing schedule. The current active phase determines how
much they will be charged for their usage, and what features they
are entitled to use.

A user will be invoiced based on the phase in which their usage
occurs.

Phases may be appended at any time in the future, in the past, or
at the current time. For example, you might

An org _must_ be given a plan before you can track usage for it.
Until then, any reservation you try to make for that org will
fail.  (They haven't signed up for your service, so they can't
use any paid features!)

## Model

The "model" is a JSON representation of the plans you define for
your application. Each plan contains a set of features, with the
tiers defined for usage within that plan. If a plan doesn't
include a feature, then that means users on that plan don't have
access to that feature.

```js
{
  "plans": {
    "plan:free@1": {
      "features": {
        "feature:song-stream": {
          "tiers": [
            // $1 each stream, but capped at 100 streams/month
            { "price": 100, "upto": 100 }
            // no tiers after this one means no more usage
          ]
        }
      }
    },
    "plan:pro@1": {
      "features": {
        "feature:song-stream": {
          "tiers": [
            // first 200 cost $0.50 each, but $10 up front
            { "price": 50, "upto": 200, "base": 1000 },
            // streams 201-1000 cost $0.10 each
            { "price": 10, "upto": 1000 }
            // then they're free
            {},
          ]
        },
        "feature:song-download": {
          "tiers": [
            // using downloads at all costs $10, but
            // no charge other than the base price
            { "base": 1000 }
          ]
        }
      }
    }
  }
}
```

### Pushing a Model

Create your model in any filename that you prefer.  We typically
use `pricing.json`.

Push the pricing model from the command line by installing one of
the [Tier SDKs](getting-started#install-a-tier-sdk) and then
running:

```bash
tier push pricing.json
```

In the background, this is just making a request to the Tier API.
You can also send it programmatically by using the
`tier.pushModel(<filename>)` function in the SDK, or by making an
http request using your tool of choice:

```bash
curl -X POST \
  -u $TIER_KEY \
  -H "Content-Type: application/json" \
  -d $(cat pricing.json)
```

## Checking and Tracking Usage

TKTK the `reserve` API stuff
