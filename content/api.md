# Tier API

# Authentication

1. Visit the [dashboard](https://app.tier.run) and navigate to the `Tokens` page.
2. Generate an API key and keep it safe.
3. Provide the key as the user key in basic auth when making calls to the Tier API (leave the password blank)

# APIs

* Plans
  * [POST plans](#plans-post)
  * [GET plans](#plans-get)
* Schedules
  * POST phase
  * GET phases
* Usage and Reservations
  * POST usage
* Payments (TODO)

<a name="whoami-get"></a>

#### `GET /api/v1/whoami` - learn about yourself

##### Parameters

None.

##### Example

```sh
curl "https://api.tier.run/api/v1/whoami" \
-u "yourapikey:"
```

Response

```json
{
        "org": "org:acme"
}
```
<a name="plans-post"></a>

#### `POST /api/v1/append` - append a phase to an organization's schedule

Appends a phase to organization's schedule. If the organization does not exist,
it will be created and the phase provided will be the first phase in the newly created organization's schedule.

<a name="plans-post"></a>

#### `POST /api/v1/schedule` - retrieve all plans in the model
#### `POST /api/v1/stripe/options` - retrieve all plans in the model
#### `POST /api/v1/stripe/setup` - retrieve all plans in the model

Adds plans to the model. Any plans at specific versions already exist, the plan will not be updated. Plan versions that do not already exist will be appended. Plan version can never be deleted.

###### 

