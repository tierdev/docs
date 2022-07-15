## Setting Up Tier

The best way to interact with Tier is by using an SDK. But if
you are using a language that is not fully supported, don't
worry! We are eager to add more, and the API surface is small.
[Get in touch](/slack), and we'll do whatever it takes to get you
supported.

### Node.js

Get [the Node.js
SDK](https://www.npmjs.com/package/@tier.run/sdk) by running:

```bash
npm install @tier.run/sdk
```

This will give you a `tier` command line client, and the library
that you can use in your application.

### Go

Get [the Go SDK](https://pkg.go.dev/tier.run/client/tier) by
running:

```bash
go get tier.run/client/tier
```

Add the following to your imports list:

```go
import (
	"tier.run/client/tier"
)
```

### Sign Up for Tier

Create an account at <https://app.tier.run> using your GitHub or
Google account.

Tier will automatically create team accounts for your authorized
GitHub or Google organizations, as well as a "solo org" for your
individual account.

### Create a Token for API Access

You can [mint a token](/tokens) to save in the `TIER_KEY`
environment variable.

Tokens are associated with the organization or solo account that
creates them.

## Define a Pricing Model

The [Pricing Model](/content/concepts/model.md) defines the
single source of truth that allows everything else in your
pricing ecosystem to be nimble while preserving safety.

Create your model by writing a `pricing.json` file, and running:

```bash
tier push pricing.json
```

You can start by modeling your actual application's pricing
model, of course, or you can use this very simple example:

```json
{
  "plans": {
    "plan:welcome@0": {
      "features": {
        "feature:test": {
          "tiers": [{}]
        }
      }
    }
  }
}
```

The pricing model can contain as many versions of as many plans
as you like. Whenever you want to make changes to a plan, just
create a file with the new version of the plan, and run `tier push` again.

(Visual plan builder UI coming soon!)

## Integrate with Tier

There are two pieces here.  The first is telling Tier whenever an
account org should be assigned to a plan, and the second is
telling Tier about usage.

### Assigning Orgs to Plans

Whenever a user signs up for your app, add them to a Plan, which
appends to their [schedule](/content/concepts/orgs.md).

```ts
import {TierClient} from '@tier.run/sdk'
import type {OrgName, PlanName} from '@tier.run/sdk'
const tier = TierClient.fromEnv()

// Put this logic wherever you currently handle sign-ups
export const onUserSignUp = async (account: User, plan: PlanName) => {
  // this appends a new phase to the org's schedule, with the
  // specified plan name, like `plan:welcome@0`
  await tier.appendPhase(`org:${account.id}`, plan)
}
```

Also call this method when an org _changes_ their plan, by
upgrading/downgrading, etc.

### Handling Usage

When checking whether a user is allowed to consume some feature,
use the `tierClient.can()` method.  When the feature is consumed,
call `tierClient.report()` to add it to their bill.

```js
if (await tier.can('org:acme', 'feature:foo')) {
  consumeOneFoo('acme')
  await tier.report('org:acme', 'feature:foo')
} else {
  // suggest they buy a bigger plan, maybe?
  showUpgradePlanUX('acme')
}
```

## Get Paid

Go to the [Account](/account) page to set up your Stripe account,
get the client-side code to safely collect payment methods and
attach them to your customer accounts, and so on.

### Collect Payment Info

Add the `tier.js` browser client to every page on your site.
This loads Stripe asynchronously, which ensures that you benefit
from their bot detection magic.

```html
<script src="https://app.tier.run/tier.js"></script>
```

Then, on the server, get a `StripeOptions` object with the Tier
SDK:

```js
const stripeOptions = await tier.stripeOptions(`org:${org_id}`);
```

And pass that to the front-end to load the payment entry form:

```html
<form id="payment-form">
  <div id="payment-element"></div>
  <button type="submit">Submit</button>
  <div id="payment-error"></div>
</form>

<script>
  // use the Tier browser client to do the browser bits
  Tier.paymentForm(<%- JSON.stringify(stripeOptions) %>, {
    form: '#payment-form',
    payment: '#payment-element',
    error: '#payment-error',
  })
	"tier.run/client/tier/apitype"
```

### Attaching Payment Method to Customer

When Stripe redirects them back to your site, finish the process
by calling `tier.stripeSetup(org, setup_intent)`.

```js
if (request.searchParams.has("setup_intent")) {
  await tier.stripeSetup(`org:${org}`, searchParams.get("setup_intent"));
}
```

If this raises an error, you can show that to the user, or
redirect them to the `er.redirect_to_url.url` if it's set.
(Usually this means that the user has to authorize something,
their card was denied, or some other problem.)

## Beyond Quickstart Guides: Iterating on Pricing Plans

If you ever want to add a new plan, just edit the `pricing.json`
file to add a new version of a plan, and push it live.

Anyone on the old plans will keep on with their existing plan
unless you explicitly call `tier.appendPhase()` at some point to
upgrade them to the new version. All the instrumentation in your
code can stay untouched.

Safe, zero-refactoring pricing iteration.

## We're here to help

We want you to be successful with this!

[Get in
touch](https://join.slack.com/t/tier-uo72534/shared_invite/zt-1b7iqereo-G2GAIenFHnpi7HX2FmUX6A)
and let us know where you're getting stuck.

Or if you're not getting stuck, then just come brag about it.
