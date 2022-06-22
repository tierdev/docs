Each feature has a set of 0 or more "tiers", which define the
prices and limits for use of that feature. Each tier has the
following fields:

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

```js
{
  "plans": {
    "plan:streamer@123": {
      "features": {
        "feature:song-stream": {
          "tiers": [
            // $1 for the first 100
            { "price": 100, "upto": 100 },
            // $0.50 thereafter
            { "price": 50 }
          ]
        }
      }
    }
  }
}
```

A feature with no tiers means that users on the plan are not
entitled to that feature.

```js
{
  "plans": {
    "plan:streamer@123": {
      "features": {
        "feature:song-stream": {
          "tiers": [{ "price": 100, "upto": 100 }, { "price": 50 }]
        },
        // Explicitly disabled. Any usage will be treated as overage.
        "features:song-download": {
          "tiers": []
        }
      }
    }
  }
}
```
