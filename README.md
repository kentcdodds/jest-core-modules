# jest-core-modules

This is a reproduction issue for a bug/help request for [jest](https://github.com/facebook/jest/issues/3577).

## Problem

Evidently, `jest` will reset and re-require all of your modules, but it wont do
that for core modules. This is normally fine unless you're doing something like
in `file.js` where you're hijacking a core-module's methods.

In a practical situation, the
[`async-listener`](https://www.npmjs.com/package/async-listener) module wraps
a bunch of things. One of those things is
[`net.Server.prototype._listen2`](https://github.com/othiym23/async-listener/blob/97d0fc92507058568fe78a34dcd88760a77aae07/index.js#L75-L93).
In my case, it's wrapping wrappers. What this means is when it
[calls the original](https://github.com/othiym23/async-listener/blob/97d0fc92507058568fe78a34dcd88760a77aae07/index.js#L84),
it's actually calling the wrapper over again, which adds another `connection`
event handler. Eventually, this results in a node warning:

> (node:77197) Warning: Possible EventEmitter memory leak detected. 11 connection listeners added. Use emitter.setMaxListeners() to increase limit

Occasionally our node process stops due to memory issues (happens more often on
Jenkins than local, but I've seen it in both places) and I suspect this is part
of the problem (if not the core problem).

## Suggested Solution

I've got no idea honestly. Other than resetting the core modules somehow? I'm
not sure how/if Jest should do that. I'm open to anything here.

## Other observations

I've only rarely seen this be a problem when running `jest` normally, most of
the time when I see this it's when running `--runInBand`. This repo demonstrates
the problem in both cases.

## Run the example:

```
git clone https://github.com/kentcdodds/jest-core-modules.git
cd jest-core-modules
yarn
yarn test
```

You'll notice that both `file1.test.js` and `file2.test.js` are exactly the same
but one of them fails. #stateFTW

## Solutions

There's a workaround you can see in the `setup-workaround` branch.
