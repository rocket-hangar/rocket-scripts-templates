"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagesOrder = void 0;
function compare(a, b) {
    const aIsHigher = 1;
    const bIsHigher = -1;
    const aHasB = a.dependencies.has(b.name);
    const bHasA = b.dependencies.has(a.name);
    if (!aHasB && !bHasA) {
        return a.name > b.name ? aIsHigher : bIsHigher;
    }
    // FIXME useless interdependent check. the circularly dependencies already checked in searchNestedDependencies()
    //if (aHasB && bHasA) {
    //  throw new Error(
    //    `"${a.name}" dependent "${b.name}" and "${b.name}" dependent "${a.name}". packages can't be interdependent.`,
    //  );
    //}
    return aHasB ? aIsHigher : bIsHigher;
}
function sort(array) {
    if (array.length < 2) {
        return array;
    }
    const chosenIndex = array.length - 1;
    const chosen = array[chosenIndex];
    const a = [];
    const b = [];
    for (let i = 0; i < chosenIndex; i++) {
        const temp = array[i];
        compare(temp, chosen) < 0 ? a.push(temp) : b.push(temp);
    }
    return [...sort(a), chosen, ...sort(b)];
}
function getPackagesOrder({ packageJsonContents }) {
    function searchNestedDependencies(ownerName, dependencies, dependenciesSet, parents) {
        if (dependencies) {
            const dependencyNames = Object.keys(dependencies);
            for (const dependencyName of dependencyNames) {
                if (dependencyName === ownerName) {
                    throw new Error(`package.json files have circularly referenced dependencies : "${ownerName}" in "${parents.join(' < ')} < ${dependencyName}"`);
                }
                dependenciesSet.add(dependencyName);
                // find dependencyName on the packageJsonContents
                const childPackageJson = packageJsonContents.find(({ name }) => dependencyName === name);
                // if childPackageJson is exists search childPackageJson's dependencies
                if (childPackageJson && childPackageJson.dependencies) {
                    searchNestedDependencies(ownerName, childPackageJson.dependencies, dependenciesSet, [
                        ...parents,
                        dependencyName,
                    ]);
                }
            }
        }
        return dependenciesSet;
    }
    // FIXME avoid Node.js 10 sort error
    const array = packageJsonContents.map((packageJson) => {
        if (!packageJson.name)
            throw new Error(`Undefined "name" field on ${packageJson}`);
        return {
            name: packageJson.name,
            dependencies: searchNestedDependencies(packageJson.name, packageJson.dependencies, new Set(), [
                packageJson.name,
            ]),
        };
    });
    return sort(array).map(({ name }) => name);
}
exports.getPackagesOrder = getPackagesOrder;
//# sourceMappingURL=getPackagesOrder.js.map