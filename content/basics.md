---
title: Tier Basic Concepts
---

This guide covers the basic concepts that Tier uses.  If you're
just getting started with Tier, and want to skip all this, check
out the [Getting Started with Tier](./getting-started.md) guide as
well.

## Table of Contents

## Orgs

<!-- include _pieces/org-intro -->

[Read more about orgs](/content/concepts/3-orgs.md)

## Features

<!-- include _pieces/feature-intro -->

## Tiers

<!-- include _pieces/feature-tier-intro -->

## Plan

<!-- include _pieces/plan-intro -->

## Schedules and Phases

Each org can be put on a given `plan:<name>@<version>` by calling
`tier.appendPhase(org, plan)`. This appends a new _phase_ to
their billing schedule. The current active phase determines how
much they will be charged for their usage, and what features they
are entitled to use.

A user will be invoiced based on the phase in which their usage
occurs.

An org _must_ be given a plan before you can track usage for it.
Until then, any reservation you try to make for that org will
fail.  (They haven't signed up for your service, so they can't
use any paid features!)

## Model

<!--include _pieces/model-intro -->

[Read more about Pricing Models](/content/concepts/1-model.md)

### Pushing a Model

<!-- include _pieces/pushing-a-model -->

## Reservations

<!-- include _pieces/reservation-intro -->

[Read more about Reservations](/content/concepts/4-reservation.md)
