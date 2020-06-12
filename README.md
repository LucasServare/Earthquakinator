# Earthquakinator

This is purely a demo project. I wrote this years ago to get a bit more familiar with Javascript / Node / Express, and am updating it now to adhere to DevOps principles and best practices.

Will flesh this out more later, but starting a running list of how this works now:

1. This is a sample app built out with Node and Express as the framework. It grabs publicly available data on earthquakes and maps them.
2. It is containerized using docker, see the dockerfile [here](https://github.com/LucasServare/Earthquakinator/blob/master/Dockerfile)
3. It has some rudimentary CI added. On a push to master, this will trigger a github action (see how that works [here](https://github.com/LucasServare/Earthquakinator/blob/master/.github/workflows/gce.yaml)) that builds a docker image, pushes it to Google's container registry, and then overwrites a running gce instance with the latest build.
4. On the gcp side, I have some storage buckets set up to house container images, and a static IP / firewall rules to allow http/s traffic.

Tons more opportunities to go!

To-do:

1. Explore using canary deploys
2. Use something like varnish or squid for http caching.
3. Set up some monitoring (playing around with the elk stack would be cool, could also flesh out gcp's built in monitoring)
4. Play around with canary deploys
5. Stop being cheap and buy a domain and link that to google's cloud dns
