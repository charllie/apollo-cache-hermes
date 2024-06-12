"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = void 0;
var tslib_1 = require("tslib");
var GraphSnapshot_1 = require("../GraphSnapshot");
var nodes_1 = require("../nodes");
var util_1 = require("../util");
var SnapshotEditor_1 = require("./SnapshotEditor");
/**
 * Returns the migrated entity snapshot. Supports add and modify but not delete
 * fields.
 */
function migrateEntity(id, snapshot, nodesToAdd, migrationMap, allNodes) {
    var e_1, _a;
    // Only if object and if valid MigrationMap is provided
    if (!util_1.isObject(snapshot.data))
        return snapshot;
    var entityMigrations = util_1.deepGet(migrationMap, ['_entities']);
    var parameterizedMigrations = util_1.deepGet(migrationMap, ['_parameterized']);
    var typeName = snapshot.data.__typename || 'Query';
    if (entityMigrations && entityMigrations[typeName]) {
        for (var field in entityMigrations[typeName]) {
            var fieldMigration = entityMigrations[typeName][field];
            if (!fieldMigration)
                continue;
            snapshot.data[field] = fieldMigration(snapshot.data[field]);
        }
    }
    if (parameterizedMigrations && parameterizedMigrations[typeName]) {
        try {
            for (var _b = tslib_1.__values(parameterizedMigrations[typeName]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var parameterized = _c.value;
                var fieldId = SnapshotEditor_1.nodeIdForParameterizedValue(id, parameterized.path, parameterized.args);
                // create a parameterized value snapshot if container doesn't know of the
                // parameterized field we expect
                if (!snapshot.outbound || !snapshot.outbound.has(fieldId)) {
                    var newData = parameterized.defaultReturn;
                    if (allNodes && parameterized.copyFrom) {
                        var _d = parameterized.copyFrom, path = _d.path, args = _d.args;
                        var copyFromFieldId = SnapshotEditor_1.nodeIdForParameterizedValue(id, path, args);
                        var copyFromNode = allNodes[copyFromFieldId];
                        if (copyFromNode) {
                            newData = copyFromNode.data;
                        }
                        else {
                            // If copyFrom doesn't exist added so we can retrieve it on read
                            nodesToAdd[copyFromFieldId] = new nodes_1.ParameterizedValueSnapshot(newData);
                        }
                    }
                    var newNode = new nodes_1.ParameterizedValueSnapshot(newData);
                    nodesToAdd[fieldId] = newNode;
                    // update the reference for the new node in the container
                    util_1.addNodeReference('inbound', newNode, id, parameterized.path);
                    util_1.addNodeReference('outbound', snapshot, fieldId, parameterized.path);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return snapshot;
}
/**
 * Migrates the CacheSnapshot. This function migrates the field values
 * in place so use it with care. Do not use it on the Hermes' current
 * CacheSnapshot. Doing so run the risk of violating immutability.
 */
function migrate(cacheSnapshot, migrationMap) {
    if (migrationMap) {
        var nodesToAdd = Object.create(null);
        var nodes = cacheSnapshot.baseline._values;
        for (var nodeId in nodes) {
            var nodeSnapshot = nodes[nodeId];
            if (nodeSnapshot instanceof nodes_1.EntitySnapshot) {
                migrateEntity(nodeId, nodeSnapshot, nodesToAdd, migrationMap, nodes);
            }
        }
        // rebuild the migrated GraphSnapshot
        var snapshots = tslib_1.__assign({}, cacheSnapshot.baseline._values);
        for (var addId in nodesToAdd) {
            var nodeToAdd = nodesToAdd[addId];
            if (!nodeToAdd)
                continue;
            snapshots[addId] = nodeToAdd;
        }
        cacheSnapshot.baseline = new GraphSnapshot_1.GraphSnapshot(snapshots);
    }
    return cacheSnapshot;
}
exports.migrate = migrate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1pZ3JhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLGtEQUFpRDtBQUNqRCxrQ0FBc0U7QUFHdEUsZ0NBR2lCO0FBRWpCLG1EQUFnRjtBQWtDaEY7OztHQUdHO0FBQ0gsU0FBUyxhQUFhLENBQ3BCLEVBQVUsRUFDVixRQUF3QixFQUN4QixVQUEyQixFQUMzQixZQUEyQixFQUMzQixRQUEwQjs7SUFHMUIsdURBQXVEO0lBQ3ZELElBQUksQ0FBQyxlQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sUUFBUSxDQUFDO0lBRTlDLElBQU0sZ0JBQWdCLEdBQUcsY0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFxQixDQUFDO0lBQ2xGLElBQU0sdUJBQXVCLEdBQUcsY0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQTRCLENBQUM7SUFFckcsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFvQixJQUFJLE9BQU8sQ0FBQztJQUUvRCxJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2xELEtBQUssSUFBTSxLQUFLLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDOUMsSUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLGNBQWM7Z0JBQUUsU0FBUztZQUM5QixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDN0Q7S0FDRjtJQUVELElBQUksdUJBQXVCLElBQUksdUJBQXVCLENBQUMsUUFBUSxDQUFDLEVBQUU7O1lBQ2hFLEtBQTRCLElBQUEsS0FBQSxpQkFBQSx1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