---
title: What Is Tier
---

Tier is a tool to help you get started charging for your
application quickly and easily, while also making it possible for
you to change your pricing model easily _and safely_ in the
future.

Tier is **pricing as code**.

## The Problem

You came up with a brilliant idea, created a proof of concept,
and shopped it around to investors.  They saw how great your idea
was, and put their money behind it.

Congratulations!

Now, you have to hurry up and start charging, before you run out
of money.  Also, the proof of concept needs a ton of work to be
production ready.

So you slap together some plans, and spend as little time as you
can creating a paid plan in your application.  Copy and paste
from a Stripe tutorial you found.  Hard code the plan names right
in there, it's fine, we just have to get _something_ working.

**We'll fix it later.**

### Later comes...

You realize that you're charging in a way that really doesn't
properly match the value that your customers get from your app.

A new competitor shows up, with a pricing model that completely
shifts the landscape.

Some users are complaining that they're being over charged, so
you hand out discounts to keep them happy.  Other customers are
quietly using up all your resources and only paying a fraction of
what they're costing you.

You know you need to change your pricing model, but your
engineering team is hesitant to touch that code, since it is tied
into _everything_.  You'll have to figure out how to handle
customers who signed up on the old plan, how to keep your
accounting in order, the problems are endless.  You're stuck.

## How Does Tier Help

Tier provides a way to define your pricing model that is _easier
to get started_, and _safe to change_.

### Easier to Start

We streamline all of the steps of getting set up with Stripe,
defining Prices, Customers, Plans, Subscriptions, and so on.

You define your pricing model as a configuration file that
specifies the features and tiers available to each plan.

When a user signs up for your application, you assign them to a
plan, using whatever unique customer identifier your application
is already using.  Any time they upgrade or downgrade their plan,
you call that same function to append a new phase to their
schedule.

Within your application, wrap your features in Tier function
calls to check entitlement and report usage.  If the user doesn't
have access to a paid feature, Tier will tell you.  If they use a
feature, Tier will track it for you.

At the end of the month, Tier will invoice the customer.

And if you're not sure _what_ you should be billing for, that's
fine!  Just wrap everything in Tier checks, mark the features as
free/unlimited, and figure it out later based on actual data.

### Safe to Change

Whenever you want to release a new version of a plan, define it
in your pricing model, and push it live.

Customers who signed up with the old plan will stay on their old
plan (unless you switch them to the new version of the plan, of
course).

New customers who sign up will use the new version of the plan.

Each customer will be charged according to the plan that they
have active and the usage that they incur under that plan.

In other words, you can try out new versions of your pricing
model at any time, as often as you like, with no code changes, and
no disruption to your application or your business.

You will not get stuck, and don't have to worry about getting
your pricing exactly right on the first try.

## Why This Is Important

Products that iterate on their pricing are more likely to
succeed.

Traditionally changes to pricing and packaging have required an
enormous amount of very careful work.  It connects to every part
of your business, and anything that goes wrong can spell
disaster, so you'd better get it right.  It's a high-risk,
low-information.

Tier says: what if, instead of being a big expensive dangerous
project, changing your pricing model was _free_ and _easy_ and
_safe_?  What if you could just test out any pricing idea you
wanted?

So go ahead and get it wrong at first.  It's fine.  Iterate until
you get it right.
