Every billing plan that a user might be signed up for is
identified with a string starting with `'plan:'`, and containing
a `@`. The part before the `@` is the "name". The part after
the `@` is the "version".

- `plan:free@2`
- `plan:pro@13`
- `plan:enterprise@custom-for-acme-signed-2022-05-13`
- `plan:pro@trial-23`
- `plan:basic@beta-user-discount-25`

You can define as many versions of as many plans as you want in
your pricing model. However, you may _not_ change a given version
of a plan, so to make changes you will create a new version of
it. This makes it possible to experiment _safely_ with pricing
changes, and only update existing customers' plans when it makes
sense for your application.

Think of your set of plans as an append-only set of the various
ways you package your application and bill your customers.
