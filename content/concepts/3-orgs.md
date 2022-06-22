---
title: Orgs
---

<!-- include _pieces/org-intro -->

## Org Schedule

Each org in the system has a schedule which determines the plan
that covers that org's usage, in the past and future.

For example:


```
$ tier fetch /api/v1/schedule?org=org:acme

{
  "phases": [
    {
      "org": "org:acme",
      "plan": "plan:start@0",
      "scheduled": "2022-06-15T10:36:38.979021-07:00",
      "effective": "2022-06-15T10:36:38.958-07:00"
    },
    {
      "org": "org:acme",
      "plan": "plan:paid@24",
      "scheduled": "2022-06-19T10:36:38.979021-07:00",
      "effective": "2022-06-19T10:36:38.958-07:00"
    }
  ]
}
```

Here we see two phases.  The first, `plan:start@0` started on
`2022-06-15`.  Then, 4 days later, they upgrade to `plan:paid@24`.

- No usage can occur _before_ the start of the first phase.  Any
  attempt to reserve usage for this time period will be rejected.
  This is also the case for orgs that do not yet have a schedule
  defined!
- Any usage that occurs after the start of a phase, and before
  the start of the next, is billed at that phase's level.

You can do this programmatically in the SDK by using
`tier.lookupSchedule(org)`.

## Appending Phases to Org Schedule

To append a phase to an org's schedule, use the
`tier.appendPhase(org:OrgName, plan:PlanName, effective?:Date)` method.

To make the new phase effective immediately, simply omit the
`effective` parameter.

The `org` parameter needs to be a valid org name (ie, a string
starting with `"org:"`) which you will use throughout the
application to record usage for this org.

The `plan` parameter needs to be a valid plan identifier with
both name and version, as defined in your [pricing
model](/content/concepts/1-model.md).

You will typically want to create an initial "free" or "start"
plan on user sign-up just to record that the org exists.  When
and if the user upgrades or changes their plan, call
`tier.appendPhase()` again to note the change.

### Example: Trials

You can use the effective date to set a user on a trial for some
period of time, and then transition them to a paid plan when
their trial expires.  For example:

```js
const 1day = 1000 * 60 * 60 * 24
const trialLength = 1day * 14 // 2 weeks

// here "account" is an object that we got from our
// database representing the account.  The "id" field is
// the unique identifier we use for the tier org.
//
// the trialPlan and paidPlan arguments come in from our
// pricing page definition.
export function paidTrial (account, trialPlan, paidPlan) {
  // put them on the free trial plan right away
  await tier.appendPhase(`org:${account.id}`, trialPlan)
  // transition to paid plan after the trial ends
  const trialEnd = new Date(Date.now() + trialLength)
  await tier.appendPhase(`org:${account.id}`, paidPlan, trialEnd)
  // however you schedule emails is up to you.
  scheduleYourTrialIsEndingEmail(account, trialEnd)
}
```

## Look Up Org Details

You can get the details about an org using the SDK by calling
`tier.lookupOrg(org)`.  This will give you information about the
org's billing details, if they have been set.

For example:

```json
{
  "id": "org:asdf1234foobar",
  "name": "org:asdf1234foobar",
  "default_payment_method": {
    "billing_details": {
      "address": {
        "country": "US",
        "postal_code": "42424"
      }
    },
    "card": {
      "brand": "visa",
      "exp_month": 4,
      "exp_year": 2024,
      "last4": "4242"
    }
  },
  "live_mode": true,
  "url": "https:/dashboard.stripe.com/test/connect/accounts/acct_9L6YuJ2CPREEhBW0/customers/cus_DBwcNBiLsLeAKt"
}
```

Included fields:

- `default_payment_method` The payment method which will be used
  to invoice the customer.
- `delinquent` Boolean
- `phone`, `email` Customer contact information
- `discount` A discount applied to the customer, in cents.
- `live_mode` Boolean. Whether the customer was created in test
  mode or live mode.
- `url` A deep link into the Stripe dashboard for this customer.
