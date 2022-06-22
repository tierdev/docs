In Tier, feature usage is recorded using "Reservations".

A reservation captures the org, feature, and amount that was
used, at some particular point in time.

The Tier API will respond with the org's current usage of the
feature and their limit (beyond which they'll be accruing overages).

The [Tier SDK](/content/node-sdk.md) will turn this into a useful
object which can be used to decide whether the org should get the
feature or not.

For example:

```js
const res = await tier.reserve('org:acme', 'feature:foo')
if (res.ok) {
  // proceed, all is good
  try {
    consumeOneFoo('acme')
  } catch (er) {
    // oh no!  it failed!  don't charge them for it
    await res.refund()
  }
} else {
  // suggest they buy a bigger plan, maybe?
  showUpgradePlanUX('acme')
}
```
