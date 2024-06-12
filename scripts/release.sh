#!/usr/bin/env bash
set -e

source ./scripts/include/node.sh

parse_version() {
  version="${1}"
  node <<-end_script
    const match = '${version}'.match(/(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    for (var i = 1; i < match.length; i++) {
      if (match[i]) {
        console.log(match[i]);
      }
    }
end_script
}

# Make sure we have all tags available
git fetch origin --tags

VERSION_TEMPLATE=$(node -p "JSON.parse(fs.readFileSync('package.json')).version")
TEMPLATE_PARTS=($(parse_version "${VERSION_TEMPLATE}"))

X="${TEMPLATE_PARTS[0]}"
Y="${TEMPLATE_PARTS[1]}"
Z="${TEMPLATE_PARTS[2]}"

NEW_VERSION="${X}.${Y}.${Z}"

echo "Releasing ${NEW_VERSION}…"
write_package_key version "${NEW_VERSION}"

npm publish

git tag v${NEW_VERSION} -m "${CIRCLE_BUILD_URL}"
git push --tags
git reset --hard HEAD\^
