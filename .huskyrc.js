function precommit(...workspaces) {
  return workspaces.map((workspace) => `yarn workspace ${workspace} run precommit`);
}

module.exports = {
  hooks: {
    'pre-commit': [
      `markdown-source-import README.md "templates/**/*.md" "examples/**/*.md" --git-add`,
      `lint-staged`,
      ...precommit(`web-template`, `electron-template`),
    ].join(' && '),
  },
};
