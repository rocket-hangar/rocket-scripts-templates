# Repeat profiling

You can auto-repeat the profiling of your app.

When the profile session is done, a file creates in the profiles directory.

You can view the profile files in the Performance Section of Chrome Dev Tools. ("Load Profile" shortcut is Cmd + O)

So you can improve your app with the profiles as proofs.

## Run this sample

```sh
npx generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/samples/repeat-profiling project-directory
cd project-directory
git init
yarn # or npm install
yarn start # or npm start
```