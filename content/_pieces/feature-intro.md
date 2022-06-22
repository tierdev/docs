Every feature in your application is identified with a string
starting with `feature:`. The rest of the string can contain any
arbitrary identifier that you use internally to reference a
feature. You can think of this as a feature flag for restricting
usage to paid features and tracking how much of something a
customer has consumed.

The feature name should identify what thing the user is trying to
do or consume, which you might bill for (or at least track). For
example:

- `feature:send-message`
- `feature:files-stored`
- `feature:bandwidth-gb`
- `feature:generate-pdf`
- `feature:read-only-seat`
- `feature:requests`
