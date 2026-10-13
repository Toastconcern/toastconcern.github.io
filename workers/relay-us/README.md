# MetaDB US relay

Meta prices an app in the currency of wherever the request comes from. The site's
built-in relay (`functions/api.js`) runs wherever Cloudflare serves the site, and on the
free plan that is often Munich or Madrid, so prices come back in euros.

This Worker fixes that. It holds one Durable Object created with the location hint
`enam` (eastern North America), so store queries leave from the US and come back in
US dollars, whichever data center handled the visit. Downloads are not priced, so they
keep going direct.

Until it is deployed and bound, the site works exactly as before.

## Deploy (once)

1. From this folder, `npx wrangler login`, then `npx wrangler deploy`. This creates the
   Worker `metadb-relay-us`. It has no public address (`workers_dev = false`).
2. In the Cloudflare dashboard, open the Pages project for metadb.toastconcern.dev, then
   **Settings → Bindings → Add → Service binding**. Name it `US_RELAY`, choose the service
   `metadb-relay-us`, and do this for Production (and Preview if you use it).
3. Redeploy the Pages project (push any commit, or **Retry deployment**), so the
   function picks up the binding.

## Check it

Open `https://metadb.toastconcern.dev/api?url=…` the way the site does, or simply look
at an app's price on the site. It should be in dollars. The relay's replies carry
`X-MetaDB-Relay: us` when they came through here.

## Another region

Change `REGION` in `src/index.js` (`wnam`, `weur`, `apac`, `oc`, …) and deploy again with
a new object name, which the code derives from the region. Cloudflare picks the city
within the region, so a region can answer in more than one currency over time.
