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
