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
  -u $TIER_KEY: \
  -H "Content-Type: application/json" \
  -d $(cat pricing.json)
```
