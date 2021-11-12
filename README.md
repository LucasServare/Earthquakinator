# Earthquakinator

This is purely a demo project. I wrote this years ago to get a bit more familiar with Javascript / Node / Express, and am updating it now to adhere to DevOps principles and best practices.

Will flesh this out more later, but starting a running list of how this works now:

1. This is a sample app built out with Node and Express as the framework. It grabs publicly available data on earthquakes and maps them.
2. It is containerized using docker, see the dockerfile [here](https://github.com/LucasServare/Earthquakinator/blob/master/Dockerfile).
3. It has some rudimentary CI added. On a push to master, this will trigger a github action (see what happens [here](https://github.com/LucasServare/Earthquakinator/blob/master/.github/workflows/deploy_to_production.yaml)) that builds a docker image, pushes it to Google's container registry.
4. We use Terraform to provision our infrastructure. After a certain amount of time, terraform destroys it (this is just to save on my monthly Google Cloud spend). You can see what we're doing [here](https://github.com/LucasServare/Earthquakinator/tree/master/terraform).

Tons more opportunities to go!

To-do:

1. Explore using canary deploys.
2. Use something like varnish or squid for http caching.
3. Add Redis somewhere here, just for fun.
4. Set up some monitoring (playing around with the elk stack would be cool, could also flesh out gcp's built in monitoring).
5. Stop being cheap and buy a domain.

Prereqs

Docker

Getting Started
To get a local copy up and running, use this:

docker build -t earthquakinator .
docker run -dp 3000:3000 earthquakinator