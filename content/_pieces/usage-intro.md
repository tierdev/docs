Feature usage can be checked by calling `tierClient.can()`, and
reported using `tierClient.report()`.

In general, if `can()` returns `false`, then the user is over the
limit or doesn't have access to the feature in their plan, so you
should not give them the feature.

`report()` can be called right away, ahead of delivering the
feature, or at any arbitrary time.

For example:

```js
if (await tier.can('org:acme', 'feature:foo')) {
  consumeOneFoo('acme')
  await tier.report('org:acme', 'feature:foo')
} else {
  // suggest they buy a bigger plan, maybe?
  showUpgradePlanUX('acme')
}
```
