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
