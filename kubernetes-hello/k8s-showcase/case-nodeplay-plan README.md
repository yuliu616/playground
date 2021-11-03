# case-nodeplay-plan

- Node.js app(express) exposed via ingress.
- dependency:
  - require ingress controller `ingress-nginx` (v4.0.6).
- serving:
  - http at port 80 via ingress.

## Installation step for volume(PV)

- this plan expect a node.js app (source code) is already installed inside the volume `nodeplay-vol`.
- set up steps:
  - copy files in `/pv-files/nodeplay-vol` to `/Users/Shared/k8s-volumes/nodeplay-vol`.

```sh
cd /Users/Shared/k8s-volumes/nodeplay-vol/express-hello
npm install
```

## Demo scope

- define nodejs app served web server.
- source code of the app is mounted as pv, therefore, could be modified freely (actually, not recommended as a container).
- define ingress as entry of web.

## test

```sh
kubectl create -f namespace.yaml
kubectl apply -f .
kubectl apply -f vol

# use curl
curl -v http://127.0.0.1/api/nodeplay/1.0/about
```

