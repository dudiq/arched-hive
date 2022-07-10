const p$2 = function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
};true&&p$2();

var styles = '';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

/**
 * Used to create unique typed service identifier.
 * Useful when service has only interface, but don't have a class.
 */
var Token = /** @class */ (function () {
    /**
     * @param name Token name, optional and only used for debugging purposes.
     */
    function Token(name) {
        this.name = name;
    }
    return Token;
}());

var __extends$2 = (globalThis && globalThis.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Thrown when requested service was not found.
 */
var ServiceNotFoundError = /** @class */ (function (_super) {
    __extends$2(ServiceNotFoundError, _super);
    function ServiceNotFoundError(identifier) {
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.name = 'ServiceNotFoundError';
        /** Normalized identifier name used in the error message. */
        _this.normalizedIdentifier = '<UNKNOWN_IDENTIFIER>';
        if (typeof identifier === 'string') {
            _this.normalizedIdentifier = identifier;
        }
        else if (identifier instanceof Token) {
            _this.normalizedIdentifier = "Token<" + (identifier.name || 'UNSET_NAME') + ">";
        }
        else if (identifier && (identifier.name || ((_a = identifier.prototype) === null || _a === void 0 ? void 0 : _a.name))) {
            _this.normalizedIdentifier =
                "MaybeConstructable<" + identifier.name + ">" ||
                    "MaybeConstructable<" + ((_b = identifier.prototype) === null || _b === void 0 ? void 0 : _b.name) + ">";
        }
        return _this;
    }
    Object.defineProperty(ServiceNotFoundError.prototype, "message", {
        get: function () {
            return ("Service with \"" + this.normalizedIdentifier + "\" identifier was not found in the container. " +
                "Register it before usage via explicitly calling the \"Container.set\" function or using the \"@Service()\" decorator.");
        },
        enumerable: false,
        configurable: true
    });
    return ServiceNotFoundError;
}(Error));

var __extends$1 = (globalThis && globalThis.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
 */
var CannotInstantiateValueError = /** @class */ (function (_super) {
    __extends$1(CannotInstantiateValueError, _super);
    function CannotInstantiateValueError(identifier) {
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.name = 'CannotInstantiateValueError';
        /** Normalized identifier name used in the error message. */
        _this.normalizedIdentifier = '<UNKNOWN_IDENTIFIER>';
        // TODO: Extract this to a helper function and share between this and NotFoundError.
        if (typeof identifier === 'string') {
            _this.normalizedIdentifier = identifier;
        }
        else if (identifier instanceof Token) {
            _this.normalizedIdentifier = "Token<" + (identifier.name || 'UNSET_NAME') + ">";
        }
        else if (identifier && (identifier.name || ((_a = identifier.prototype) === null || _a === void 0 ? void 0 : _a.name))) {
            _this.normalizedIdentifier =
                "MaybeConstructable<" + identifier.name + ">" ||
                    "MaybeConstructable<" + ((_b = identifier.prototype) === null || _b === void 0 ? void 0 : _b.name) + ">";
        }
        return _this;
    }
    Object.defineProperty(CannotInstantiateValueError.prototype, "message", {
        get: function () {
            return ("Cannot instantiate the requested value for the \"" + this.normalizedIdentifier + "\" identifier. " +
                "The related metadata doesn't contain a factory or a type to instantiate.");
        },
        enumerable: false,
        configurable: true
    });
    return CannotInstantiateValueError;
}(Error));

var EMPTY_VALUE = Symbol('EMPTY_VALUE');

var __assign$1 = (globalThis && globalThis.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __spreadArrays = (globalThis && globalThis.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * TypeDI can have multiple containers.
 * One container is ContainerInstance.
 */
var ContainerInstance = /** @class */ (function () {
    function ContainerInstance(id) {
        /** All registered services in the container. */
        this.services = [];
        this.id = id;
    }
    ContainerInstance.prototype.has = function (identifier) {
        return !!this.findService(identifier);
    };
    ContainerInstance.prototype.get = function (identifier) {
        var globalContainer = Container$n.of(undefined);
        var globalService = globalContainer.findService(identifier);
        var scopedService = this.findService(identifier);
        if (globalService && globalService.global === true)
            return this.getServiceValue(globalService);
        if (scopedService)
            return this.getServiceValue(scopedService);
        /** If it's the first time requested in the child container we load it from parent and set it. */
        if (globalService && this !== globalContainer) {
            var clonedService = __assign$1({}, globalService);
            clonedService.value = EMPTY_VALUE;
            /**
             * We need to immediately set the empty value from the root container
             * to prevent infinite lookup in cyclic dependencies.
             */
            this.set(clonedService);
            var value = this.getServiceValue(clonedService);
            this.set(__assign$1(__assign$1({}, clonedService), { value: value }));
            return value;
        }
        if (globalService)
            return this.getServiceValue(globalService);
        throw new ServiceNotFoundError(identifier);
    };
    ContainerInstance.prototype.getMany = function (identifier) {
        var _this = this;
        return this.findAllServices(identifier).map(function (service) { return _this.getServiceValue(service); });
    };
    ContainerInstance.prototype.set = function (identifierOrServiceMetadata, value) {
        var _this = this;
        if (identifierOrServiceMetadata instanceof Array) {
            identifierOrServiceMetadata.forEach(function (data) { return _this.set(data); });
            return this;
        }
        if (typeof identifierOrServiceMetadata === 'string' || identifierOrServiceMetadata instanceof Token) {
            return this.set({
                id: identifierOrServiceMetadata,
                type: null,
                value: value,
                factory: undefined,
                global: false,
                multiple: false,
                eager: false,
                transient: false,
            });
        }
        if (typeof identifierOrServiceMetadata === 'function') {
            return this.set({
                id: identifierOrServiceMetadata,
                // TODO: remove explicit casting
                type: identifierOrServiceMetadata,
                value: value,
                factory: undefined,
                global: false,
                multiple: false,
                eager: false,
                transient: false,
            });
        }
        var newService = __assign$1({ id: new Token('UNREACHABLE'), type: null, factory: undefined, value: EMPTY_VALUE, global: false, multiple: false, eager: false, transient: false }, identifierOrServiceMetadata);
        var service = this.findService(newService.id);
        if (service && service.multiple !== true) {
            Object.assign(service, newService);
        }
        else {
            this.services.push(newService);
        }
        if (newService.eager) {
            this.get(newService.id);
        }
        return this;
    };
    /**
     * Removes services with a given service identifiers.
     */
    ContainerInstance.prototype.remove = function (identifierOrIdentifierArray) {
        var _this = this;
        if (Array.isArray(identifierOrIdentifierArray)) {
            identifierOrIdentifierArray.forEach(function (id) { return _this.remove(id); });
        }
        else {
            this.services = this.services.filter(function (service) {
                if (service.id === identifierOrIdentifierArray) {
                    _this.destroyServiceInstance(service);
                    return false;
                }
                return true;
            });
        }
        return this;
    };
    /**
     * Completely resets the container by removing all previously registered services from it.
     */
    ContainerInstance.prototype.reset = function (options) {
        var _this = this;
        if (options === void 0) { options = { strategy: 'resetValue' }; }
        switch (options.strategy) {
            case 'resetValue':
                this.services.forEach(function (service) { return _this.destroyServiceInstance(service); });
                break;
            case 'resetServices':
                this.services.forEach(function (service) { return _this.destroyServiceInstance(service); });
                this.services = [];
                break;
            default:
                throw new Error('Received invalid reset strategy.');
        }
        return this;
    };
    /**
     * Returns all services registered with the given identifier.
     */
    ContainerInstance.prototype.findAllServices = function (identifier) {
        return this.services.filter(function (service) { return service.id === identifier; });
    };
    /**
     * Finds registered service in the with a given service identifier.
     */
    ContainerInstance.prototype.findService = function (identifier) {
        return this.services.find(function (service) { return service.id === identifier; });
    };
    /**
     * Gets the value belonging to `serviceMetadata.id`.
     *
     * - if `serviceMetadata.value` is already set it is immediately returned
     * - otherwise the requested type is resolved to the value saved to `serviceMetadata.value` and returned
     */
    ContainerInstance.prototype.getServiceValue = function (serviceMetadata) {
        var _a;
        var value = EMPTY_VALUE;
        /**
         * If the service value has been set to anything prior to this call we return that value.
         * NOTE: This part builds on the assumption that transient dependencies has no value set ever.
         */
        if (serviceMetadata.value !== EMPTY_VALUE) {
            return serviceMetadata.value;
        }
        /** If both factory and type is missing, we cannot resolve the requested ID. */
        if (!serviceMetadata.factory && !serviceMetadata.type) {
            throw new CannotInstantiateValueError(serviceMetadata.id);
        }
        /**
         * If a factory is defined it takes priority over creating an instance via `new`.
         * The return value of the factory is not checked, we believe by design that the user knows what he/she is doing.
         */
        if (serviceMetadata.factory) {
            /**
             * If we received the factory in the [Constructable<Factory>, "functionName"] format, we need to create the
             * factory first and then call the specified function on it.
             */
            if (serviceMetadata.factory instanceof Array) {
                var factoryInstance = void 0;
                try {
                    /** Try to get the factory from TypeDI first, if failed, fall back to simply initiating the class. */
                    factoryInstance = this.get(serviceMetadata.factory[0]);
                }
                catch (error) {
                    if (error instanceof ServiceNotFoundError) {
                        factoryInstance = new serviceMetadata.factory[0]();
                    }
                    else {
                        throw error;
                    }
                }
                value = factoryInstance[serviceMetadata.factory[1]](this, serviceMetadata.id);
            }
            else {
                /** If only a simple function was provided we simply call it. */
                value = serviceMetadata.factory(this, serviceMetadata.id);
            }
        }
        /**
         * If no factory was provided and only then, we create the instance from the type if it was set.
         */
        if (!serviceMetadata.factory && serviceMetadata.type) {
            var constructableTargetType = serviceMetadata.type;
            // setup constructor parameters for a newly initialized service
            var paramTypes = ((_a = Reflect) === null || _a === void 0 ? void 0 : _a.getMetadata('design:paramtypes', constructableTargetType)) || [];
            var params = this.initializeParams(constructableTargetType, paramTypes);
            // "extra feature" - always pass container instance as the last argument to the service function
            // this allows us to support javascript where we don't have decorators and emitted metadata about dependencies
            // need to be injected, and user can use provided container to get instances he needs
            params.push(this);
            value = new (constructableTargetType.bind.apply(constructableTargetType, __spreadArrays([void 0], params)))();
            // TODO: Calling this here, leads to infinite loop, because @Inject decorator registerds a handler
            // TODO: which calls Container.get, which will check if the requested type has a value set and if not
            // TODO: it will start the instantiation process over. So this is currently called outside of the if branch
            // TODO: after the current value has been assigned to the serviceMetadata.
            // this.applyPropertyHandlers(constructableTargetType, value as Constructable<unknown>);
        }
        /** If this is not a transient service, and we resolved something, then we set it as the value. */
        if (!serviceMetadata.transient && value !== EMPTY_VALUE) {
            serviceMetadata.value = value;
        }
        if (value === EMPTY_VALUE) {
            /** This branch should never execute, but better to be safe than sorry. */
            throw new CannotInstantiateValueError(serviceMetadata.id);
        }
        if (serviceMetadata.type) {
            this.applyPropertyHandlers(serviceMetadata.type, value);
        }
        return value;
    };
    /**
     * Initializes all parameter types for a given target service class.
     */
    ContainerInstance.prototype.initializeParams = function (target, paramTypes) {
        var _this = this;
        return paramTypes.map(function (paramType, index) {
            var paramHandler = Container$n.handlers.find(function (handler) {
                /**
                 * @Inject()-ed values are stored as parameter handlers and they reference their target
                 * when created. So when a class is extended the @Inject()-ed values are not inherited
                 * because the handler still points to the old object only.
                 *
                 * As a quick fix a single level parent lookup is added via `Object.getPrototypeOf(target)`,
                 * however this should be updated to a more robust solution.
                 *
                 * TODO: Add proper inheritance handling: either copy the handlers when a class is registered what
                 * TODO: has it's parent already registered as dependency or make the lookup search up to the base Object.
                 */
                return ((handler.object === target || handler.object === Object.getPrototypeOf(target)) && handler.index === index);
            });
            if (paramHandler)
                return paramHandler.value(_this);
            if (paramType && paramType.name && !_this.isPrimitiveParamType(paramType.name)) {
                return _this.get(paramType);
            }
            return undefined;
        });
    };
    /**
     * Checks if given parameter type is primitive type or not.
     */
    ContainerInstance.prototype.isPrimitiveParamType = function (paramTypeName) {
        return ['string', 'boolean', 'number', 'object'].includes(paramTypeName.toLowerCase());
    };
    /**
     * Applies all registered handlers on a given target class.
     */
    ContainerInstance.prototype.applyPropertyHandlers = function (target, instance) {
        var _this = this;
        Container$n.handlers.forEach(function (handler) {
            if (typeof handler.index === 'number')
                return;
            if (handler.object.constructor !== target && !(target.prototype instanceof handler.object.constructor))
                return;
            if (handler.propertyName) {
                instance[handler.propertyName] = handler.value(_this);
            }
        });
    };
    /**
     * Checks if the given service metadata contains a destroyable service instance and destroys it in place. If the service
     * contains a callable function named `destroy` it is called but not awaited and the return value is ignored..
     *
     * @param serviceMetadata the service metadata containing the instance to destroy
     * @param force when true the service will be always destroyed even if it's cannot be re-created
     */
    ContainerInstance.prototype.destroyServiceInstance = function (serviceMetadata, force) {
        if (force === void 0) { force = false; }
        /** We reset value only if we can re-create it (aka type or factory exists). */
        var shouldResetValue = force || !!serviceMetadata.type || !!serviceMetadata.factory;
        if (shouldResetValue) {
            /** If we wound a function named destroy we call it without any params. */
            if (typeof (serviceMetadata === null || serviceMetadata === void 0 ? void 0 : serviceMetadata.value)['destroy'] === 'function') {
                try {
                    serviceMetadata.value.destroy();
                }
                catch (error) {
                    /** We simply ignore the errors from the destroy function. */
                }
            }
            serviceMetadata.value = EMPTY_VALUE;
        }
    };
    return ContainerInstance;
}());

/**
 * Service container.
 */
var Container$n = /** @class */ (function () {
    function Container() {
    }
    /**
     * Gets a separate container instance for the given instance id.
     */
    Container.of = function (containerId) {
        if (containerId === void 0) { containerId = 'default'; }
        if (containerId === 'default')
            return this.globalInstance;
        var container = this.instances.find(function (instance) { return instance.id === containerId; });
        if (!container) {
            container = new ContainerInstance(containerId);
            this.instances.push(container);
            // TODO: Why we are not reseting here? Let's reset here. (I have added the commented code.)
            // container.reset();
        }
        return container;
    };
    Container.has = function (identifier) {
        return this.globalInstance.has(identifier);
    };
    Container.get = function (identifier) {
        return this.globalInstance.get(identifier);
    };
    Container.getMany = function (id) {
        return this.globalInstance.getMany(id);
    };
    Container.set = function (identifierOrServiceMetadata, value) {
        this.globalInstance.set(identifierOrServiceMetadata, value);
        return this;
    };
    /**
     * Removes services with a given service identifiers.
     */
    Container.remove = function (identifierOrIdentifierArray) {
        this.globalInstance.remove(identifierOrIdentifierArray);
        return this;
    };
    /**
     * Completely resets the container by removing all previously registered services and handlers from it.
     */
    Container.reset = function (containerId) {
        if (containerId === void 0) { containerId = 'default'; }
        if (containerId == 'default') {
            this.globalInstance.reset();
            this.instances.forEach(function (instance) { return instance.reset(); });
        }
        else {
            var instance = this.instances.find(function (instance) { return instance.id === containerId; });
            if (instance) {
                instance.reset();
                this.instances.splice(this.instances.indexOf(instance), 1);
            }
        }
        return this;
    };
    /**
     * Registers a new handler.
     */
    Container.registerHandler = function (handler) {
        this.handlers.push(handler);
        return this;
    };
    /**
     * Helper method that imports given services.
     */
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Container.import = function (services) {
        return this;
    };
    /**
     * All registered handlers. The @Inject() decorator uses handlers internally to mark a property for injection.
     **/
    Container.handlers = [];
    /**  Global container instance. */
    Container.globalInstance = new ContainerInstance('default');
    /** Other containers created using Container.of method. */
    Container.instances = [];
    return Container;
}());

var __extends = (globalThis && globalThis.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
 */
var CannotInjectValueError = /** @class */ (function (_super) {
    __extends(CannotInjectValueError, _super);
    function CannotInjectValueError(target, propertyName) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.propertyName = propertyName;
        _this.name = 'CannotInjectValueError';
        return _this;
    }
    Object.defineProperty(CannotInjectValueError.prototype, "message", {
        get: function () {
            return ("Cannot inject value into \"" + this.target.constructor.name + "." + this.propertyName + "\". " +
                "Please make sure you setup reflect-metadata properly and you don't use interfaces without service tokens as injection value.");
        },
        enumerable: false,
        configurable: true
    });
    return CannotInjectValueError;
}(Error));

/**
 * Helper function used in inject decorators to resolve the received identifier to
 * an eager type when possible or to a lazy type when cyclic dependencies are possibly involved.
 *
 * @param typeOrIdentifier a service identifier or a function returning a type acting as service identifier or nothing
 * @param target the class definition of the target of the decorator
 * @param propertyName the name of the property in case of a PropertyDecorator
 * @param index the index of the parameter in the constructor in case of ParameterDecorator
 */
function resolveToTypeWrapper(typeOrIdentifier, target, propertyName, index) {
    /**
     * ? We want to error out as soon as possible when looking up services to inject, however
     * ? we cannot determine the type at decorator execution when cyclic dependencies are involved
     * ? because calling the received `() => MyType` function right away would cause a JS error:
     * ? "Cannot access 'MyType' before initialization", so we need to execute the function in the handler,
     * ? when the classes are already created. To overcome this, we use a wrapper:
     * ?  - the lazyType is executed in the handler so we never have a JS error
     * ?  - the eagerType is checked when decorator is running and an error is raised if an unknown type is encountered
     */
    var typeWrapper;
    /** If requested type is explicitly set via a string ID or token, we set it explicitly. */
    if ((typeOrIdentifier && typeof typeOrIdentifier === 'string') || typeOrIdentifier instanceof Token) {
        typeWrapper = { eagerType: typeOrIdentifier, lazyType: function () { return typeOrIdentifier; } };
    }
    /** If requested type is explicitly set via a () => MyClassType format, we set it explicitly. */
    if (typeOrIdentifier && typeof typeOrIdentifier === 'function') {
        /** We set eagerType to null, preventing the raising of the CannotInjectValueError in decorators.  */
        typeWrapper = { eagerType: null, lazyType: function () { return typeOrIdentifier(); } };
    }
    /** If no explicit type is set and handler registered for a class property, we need to get the property type. */
    if (!typeOrIdentifier && propertyName) {
        var identifier_1 = Reflect.getMetadata('design:type', target, propertyName);
        typeWrapper = { eagerType: identifier_1, lazyType: function () { return identifier_1; } };
    }
    /** If no explicit type is set and handler registered for a constructor parameter, we need to get the parameter types. */
    if (!typeOrIdentifier && typeof index == 'number' && Number.isInteger(index)) {
        var paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyName);
        /** It's not guaranteed, that we find any types for the constructor. */
        var identifier_2 = paramTypes === null || paramTypes === void 0 ? void 0 : paramTypes[index];
        typeWrapper = { eagerType: identifier_2, lazyType: function () { return identifier_2; } };
    }
    return typeWrapper;
}

function Inject(typeOrIdentifier) {
    return function (target, propertyName, index) {
        var typeWrapper = resolveToTypeWrapper(typeOrIdentifier, target, propertyName, index);
        /** If no type was inferred, or the general Object type was inferred we throw an error. */
        if (typeWrapper === undefined || typeWrapper.eagerType === undefined || typeWrapper.eagerType === Object) {
            throw new CannotInjectValueError(target, propertyName);
        }
        Container$n.registerHandler({
            object: target,
            propertyName: propertyName,
            index: index,
            value: function (containerInstance) {
                var evaluatedLazyType = typeWrapper.lazyType();
                /** If no type was inferred lazily, or the general Object type was inferred we throw an error. */
                if (evaluatedLazyType === undefined || evaluatedLazyType === Object) {
                    throw new CannotInjectValueError(target, propertyName);
                }
                return containerInstance.get(evaluatedLazyType);
            },
        });
    };
}

function Service(optionsOrServiceIdentifier) {
    return function (targetConstructor) {
        var serviceMetadata = {
            id: targetConstructor,
            // TODO: Let's investigate why we receive Function type instead of a constructable.
            type: targetConstructor,
            factory: undefined,
            multiple: false,
            global: false,
            eager: false,
            transient: false,
            value: EMPTY_VALUE,
        };
        if (optionsOrServiceIdentifier instanceof Token || typeof optionsOrServiceIdentifier === 'string') {
            /** We received a Token or string ID. */
            serviceMetadata.id = optionsOrServiceIdentifier;
        }
        else if (optionsOrServiceIdentifier) {
            /** We received a ServiceOptions object. */
            serviceMetadata.id = optionsOrServiceIdentifier.id || targetConstructor;
            serviceMetadata.factory = optionsOrServiceIdentifier.factory || undefined;
            serviceMetadata.multiple = optionsOrServiceIdentifier.multiple || false;
            serviceMetadata.global = optionsOrServiceIdentifier.global || false;
            serviceMetadata.eager = optionsOrServiceIdentifier.eager || false;
            serviceMetadata.transient = optionsOrServiceIdentifier.transient || false;
        }
        Container$n.set(serviceMetadata);
    };
}

// eslint-disable-next-line no-restricted-imports
function DataProvider() {
  return function extend(Context) {
    const serviceFn = Service();
    return serviceFn(Context);
  };
}

// eslint-disable-next-line no-restricted-imports
function Adapter() {
  return function extend(Context) {
    const serviceFn = Service();
    return serviceFn(Context);
  };
}

function die(error) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  throw new Error(typeof error === "number" ? "[MobX] minified error nr: " + error + (args.length ? " " + args.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + error);
}

var mockGlobal = {};
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }

  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  if (typeof self !== "undefined") {
    return self;
  }

  return mockGlobal;
}

var assign = Object.assign;
var getDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty$1 = Object.defineProperty;
var objectPrototype$1 = Object.prototype;
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
var hasProxy = typeof Proxy !== "undefined";
var plainObjectString = /*#__PURE__*/Object.toString();
function assertProxies() {
  if (!hasProxy) {
    die("Proxy not available");
  }
}
/**
 * Makes sure that the provided function is invoked at most once.
 */

function once(func) {
  var invoked = false;
  return function () {
    if (invoked) {
      return;
    }

    invoked = true;
    return func.apply(this, arguments);
  };
}
var noop = function noop() {};
function isFunction(fn) {
  return typeof fn === "function";
}
function isStringish(value) {
  var t = typeof value;

  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return true;
  }

  return false;
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }

  var proto = Object.getPrototypeOf(value);

  if (proto == null) {
    return true;
  }

  var protoConstructor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof protoConstructor === "function" && protoConstructor.toString() === plainObjectString;
} // https://stackoverflow.com/a/37865170

function isGenerator(obj) {
  var constructor = obj == null ? void 0 : obj.constructor;

  if (!constructor) {
    return false;
  }

  if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) {
    return true;
  }

  return false;
}
function addHiddenProp(object, propName, value) {
  defineProperty$1(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value
  });
}
function addHiddenFinalProp(object, propName, value) {
  defineProperty$1(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: value
  });
}
function createInstanceofPredicate(name, theClass) {
  var propName = "isMobX" + name;
  theClass.prototype[propName] = true;
  return function (x) {
    return isObject(x) && x[propName] === true;
  };
}
function isES6Map(thing) {
  return thing instanceof Map;
}
function isES6Set(thing) {
  return thing instanceof Set;
}
var hasGetOwnPropertySymbols = typeof Object.getOwnPropertySymbols !== "undefined";
/**
 * Returns the following: own enumerable keys and symbols.
 */

function getPlainObjectKeys(object) {
  var keys = Object.keys(object); // Not supported in IE, so there are not going to be symbol props anyway...

  if (!hasGetOwnPropertySymbols) {
    return keys;
  }

  var symbols = Object.getOwnPropertySymbols(object);

  if (!symbols.length) {
    return keys;
  }

  return [].concat(keys, symbols.filter(function (s) {
    return objectPrototype$1.propertyIsEnumerable.call(object, s);
  }));
} // From Immer utils
// Returns all own keys, including non-enumerable and symbolic

var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : hasGetOwnPropertySymbols ? function (obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} :
/* istanbul ignore next */
Object.getOwnPropertyNames;
function toPrimitive(value) {
  return value === null ? null : typeof value === "object" ? "" + value : value;
}
function hasProp(target, prop) {
  return objectPrototype$1.hasOwnProperty.call(target, prop);
} // From Immer utils

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(target) {
  // Polyfill needed for Hermes and IE, see https://github.com/facebook/hermes/issues/274
  var res = {}; // Note: without polyfill for ownKeys, symbols won't be picked up

  ownKeys(target).forEach(function (key) {
    res[key] = getDescriptor(target, key);
  });
  return res;
};

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var storedAnnotationsSymbol = /*#__PURE__*/Symbol("mobx-stored-annotations");
/**
 * Creates a function that acts as
 * - decorator
 * - annotation object
 */

function createDecoratorAnnotation(annotation) {
  function decorator(target, property) {
    storeAnnotation(target, property, annotation);
  }

  return Object.assign(decorator, annotation);
}
/**
 * Stores annotation to prototype,
 * so it can be inspected later by `makeObservable` called from constructor
 */

function storeAnnotation(prototype, key, annotation) {
  if (!hasProp(prototype, storedAnnotationsSymbol)) {
    addHiddenProp(prototype, storedAnnotationsSymbol, _extends({}, prototype[storedAnnotationsSymbol]));
  } // @override must override something

  if (!isOverride(annotation)) {
    prototype[storedAnnotationsSymbol][key] = annotation;
  }
}
/**
 * Collects annotations from prototypes and stores them on target (instance)
 */


function collectStoredAnnotations(target) {
  if (!hasProp(target, storedAnnotationsSymbol)) {


    addHiddenProp(target, storedAnnotationsSymbol, _extends({}, target[storedAnnotationsSymbol]));
  }

  return target[storedAnnotationsSymbol];
}

var $mobx = /*#__PURE__*/Symbol("mobx administration");
var Atom = /*#__PURE__*/function () {
  // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed

  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */
  function Atom(name_) {
    if (name_ === void 0) {
      name_ = "Atom";
    }

    this.name_ = void 0;
    this.isPendingUnobservation_ = false;
    this.isBeingObserved_ = false;
    this.observers_ = new Set();
    this.diffValue_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.NOT_TRACKING_;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    this.name_ = name_;
  } // onBecomeObservedListeners


  var _proto = Atom.prototype;

  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function (listener) {
        return listener();
      });
    }
  };

  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function (listener) {
        return listener();
      });
    }
  }
  /**
   * Invoke this method to notify mobx that your atom has been used somehow.
   * Returns true if there is currently a reactive context.
   */
  ;

  _proto.reportObserved = function reportObserved$1() {
    return reportObserved(this);
  }
  /**
   * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
   */
  ;

  _proto.reportChanged = function reportChanged() {
    startBatch();
    propagateChanged(this);
    endBatch();
  };

  _proto.toString = function toString() {
    return this.name_;
  };

  return Atom;
}();
var isAtom = /*#__PURE__*/createInstanceofPredicate("Atom", Atom);
function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
  if (onBecomeObservedHandler === void 0) {
    onBecomeObservedHandler = noop;
  }

  if (onBecomeUnobservedHandler === void 0) {
    onBecomeUnobservedHandler = noop;
  }

  var atom = new Atom(name); // default `noop` listener will not initialize the hook Set

  if (onBecomeObservedHandler !== noop) {
    onBecomeObserved(atom, onBecomeObservedHandler);
  }

  if (onBecomeUnobservedHandler !== noop) {
    onBecomeUnobserved(atom, onBecomeUnobservedHandler);
  }

  return atom;
}

function identityComparer(a, b) {
  return a === b;
}

function structuralComparer(a, b) {
  return deepEqual(a, b);
}

function shallowComparer(a, b) {
  return deepEqual(a, b, 1);
}

function defaultComparer(a, b) {
  if (Object.is) {
    return Object.is(a, b);
  }

  return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
}

var comparer = {
  identity: identityComparer,
  structural: structuralComparer,
  "default": defaultComparer,
  shallow: shallowComparer
};

function deepEnhancer(v, _, name) {
  // it is an observable already, done
  if (isObservable(v)) {
    return v;
  } // something that can be converted and mutated?


  if (Array.isArray(v)) {
    return observable.array(v, {
      name: name
    });
  }

  if (isPlainObject(v)) {
    return observable.object(v, undefined, {
      name: name
    });
  }

  if (isES6Map(v)) {
    return observable.map(v, {
      name: name
    });
  }

  if (isES6Set(v)) {
    return observable.set(v, {
      name: name
    });
  }

  if (typeof v === "function" && !isAction(v) && !isFlow(v)) {
    if (isGenerator(v)) {
      return flow(v);
    } else {
      return autoAction(name, v);
    }
  }

  return v;
}
function shallowEnhancer(v, _, name) {
  if (v === undefined || v === null) {
    return v;
  }

  if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v)) {
    return v;
  }

  if (Array.isArray(v)) {
    return observable.array(v, {
      name: name,
      deep: false
    });
  }

  if (isPlainObject(v)) {
    return observable.object(v, undefined, {
      name: name,
      deep: false
    });
  }

  if (isES6Map(v)) {
    return observable.map(v, {
      name: name,
      deep: false
    });
  }

  if (isES6Set(v)) {
    return observable.set(v, {
      name: name,
      deep: false
    });
  }
}
function referenceEnhancer(newValue) {
  // never turn into an observable
  return newValue;
}
function refStructEnhancer(v, oldValue) {

  if (deepEqual(v, oldValue)) {
    return oldValue;
  }

  return v;
}

var OVERRIDE = "override";
function isOverride(annotation) {
  return annotation.annotationType_ === OVERRIDE;
}

function createActionAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$1,
    extend_: extend_$1
  };
}

function make_$1(adm, key, descriptor, source) {
  var _this$options_;

  // bound
  if ((_this$options_ = this.options_) != null && _this$options_.bound) {
    return this.extend_(adm, key, descriptor, false) === null ? 0
    /* Cancel */
    : 1
    /* Break */
    ;
  } // own


  if (source === adm.target_) {
    return this.extend_(adm, key, descriptor, false) === null ? 0
    /* Cancel */
    : 2
    /* Continue */
    ;
  } // prototype


  if (isAction(descriptor.value)) {
    // A prototype could have been annotated already by other constructor,
    // rest of the proto chain must be annotated already
    return 1
    /* Break */
    ;
  }

  var actionDescriptor = createActionDescriptor(adm, this, key, descriptor, false);
  defineProperty$1(source, key, actionDescriptor);
  return 2
  /* Continue */
  ;
}

function extend_$1(adm, key, descriptor, proxyTrap) {
  var actionDescriptor = createActionDescriptor(adm, this, key, descriptor);
  return adm.defineProperty_(key, actionDescriptor, proxyTrap);
}

function assertActionDescriptor(adm, _ref, key, _ref2) {
  _ref.annotationType_;
  _ref2.value;
}

function createActionDescriptor(adm, annotation, key, descriptor, // provides ability to disable safeDescriptors for prototypes
safeDescriptors) {
  var _annotation$options_, _annotation$options_$, _annotation$options_2, _annotation$options_$2, _annotation$options_3, _annotation$options_4, _adm$proxy_2;

  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }

  assertActionDescriptor(adm, annotation, key, descriptor);
  var value = descriptor.value;

  if ((_annotation$options_ = annotation.options_) != null && _annotation$options_.bound) {
    var _adm$proxy_;

    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }

  return {
    value: createAction((_annotation$options_$ = (_annotation$options_2 = annotation.options_) == null ? void 0 : _annotation$options_2.name) != null ? _annotation$options_$ : key.toString(), value, (_annotation$options_$2 = (_annotation$options_3 = annotation.options_) == null ? void 0 : _annotation$options_3.autoAction) != null ? _annotation$options_$2 : false, // https://github.com/mobxjs/mobx/discussions/3140
    (_annotation$options_4 = annotation.options_) != null && _annotation$options_4.bound ? (_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_ : undefined),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}

function createFlowAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$2,
    extend_: extend_$2
  };
}

function make_$2(adm, key, descriptor, source) {
  var _this$options_;

  // own
  if (source === adm.target_) {
    return this.extend_(adm, key, descriptor, false) === null ? 0
    /* Cancel */
    : 2
    /* Continue */
    ;
  } // prototype
  // bound - must annotate protos to support super.flow()


  if ((_this$options_ = this.options_) != null && _this$options_.bound && (!hasProp(adm.target_, key) || !isFlow(adm.target_[key]))) {
    if (this.extend_(adm, key, descriptor, false) === null) {
      return 0
      /* Cancel */
      ;
    }
  }

  if (isFlow(descriptor.value)) {
    // A prototype could have been annotated already by other constructor,
    // rest of the proto chain must be annotated already
    return 1
    /* Break */
    ;
  }

  var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, false, false);
  defineProperty$1(source, key, flowDescriptor);
  return 2
  /* Continue */
  ;
}

function extend_$2(adm, key, descriptor, proxyTrap) {
  var _this$options_2;

  var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, (_this$options_2 = this.options_) == null ? void 0 : _this$options_2.bound);
  return adm.defineProperty_(key, flowDescriptor, proxyTrap);
}

function assertFlowDescriptor(adm, _ref, key, _ref2) {
  _ref.annotationType_;
  _ref2.value;
}

function createFlowDescriptor(adm, annotation, key, descriptor, bound, // provides ability to disable safeDescriptors for prototypes
safeDescriptors) {
  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }

  assertFlowDescriptor(adm, annotation, key, descriptor);
  var value = descriptor.value; // In case of flow.bound, the descriptor can be from already annotated prototype

  if (!isFlow(value)) {
    value = flow(value);
  }

  if (bound) {
    var _adm$proxy_;

    // We do not keep original function around, so we bind the existing flow
    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_); // This is normally set by `flow`, but `bind` returns new function...

    value.isMobXFlow = true;
  }

  return {
    value: value,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}

function createComputedAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$3,
    extend_: extend_$3
  };
}

function make_$3(adm, key, descriptor) {
  return this.extend_(adm, key, descriptor, false) === null ? 0
  /* Cancel */
  : 1
  /* Break */
  ;
}

function extend_$3(adm, key, descriptor, proxyTrap) {
  assertComputedDescriptor(adm, this, key, descriptor);
  return adm.defineComputedProperty_(key, _extends({}, this.options_, {
    get: descriptor.get,
    set: descriptor.set
  }), proxyTrap);
}

function assertComputedDescriptor(adm, _ref, key, _ref2) {
  _ref.annotationType_;
  _ref2.get;
}

function createObservableAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$4,
    extend_: extend_$4
  };
}

function make_$4(adm, key, descriptor) {
  return this.extend_(adm, key, descriptor, false) === null ? 0
  /* Cancel */
  : 1
  /* Break */
  ;
}

function extend_$4(adm, key, descriptor, proxyTrap) {
  var _this$options_$enhanc, _this$options_;

  assertObservableDescriptor(adm, this);
  return adm.defineObservableProperty_(key, descriptor.value, (_this$options_$enhanc = (_this$options_ = this.options_) == null ? void 0 : _this$options_.enhancer) != null ? _this$options_$enhanc : deepEnhancer, proxyTrap);
}

function assertObservableDescriptor(adm, _ref, key, descriptor) {
  _ref.annotationType_;
}

var AUTO = "true";
var autoAnnotation = /*#__PURE__*/createAutoAnnotation();
function createAutoAnnotation(options) {
  return {
    annotationType_: AUTO,
    options_: options,
    make_: make_$5,
    extend_: extend_$5
  };
}

function make_$5(adm, key, descriptor, source) {
  var _this$options_3, _this$options_4;

  // getter -> computed
  if (descriptor.get) {
    return computed.make_(adm, key, descriptor, source);
  } // lone setter -> action setter


  if (descriptor.set) {
    // TODO make action applicable to setter and delegate to action.make_
    var set = createAction(key.toString(), descriptor.set); // own

    if (source === adm.target_) {
      return adm.defineProperty_(key, {
        configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
        set: set
      }) === null ? 0
      /* Cancel */
      : 2
      /* Continue */
      ;
    } // proto


    defineProperty$1(source, key, {
      configurable: true,
      set: set
    });
    return 2
    /* Continue */
    ;
  } // function on proto -> autoAction/flow


  if (source !== adm.target_ && typeof descriptor.value === "function") {
    var _this$options_2;

    if (isGenerator(descriptor.value)) {
      var _this$options_;

      var flowAnnotation = (_this$options_ = this.options_) != null && _this$options_.autoBind ? flow.bound : flow;
      return flowAnnotation.make_(adm, key, descriptor, source);
    }

    var actionAnnotation = (_this$options_2 = this.options_) != null && _this$options_2.autoBind ? autoAction.bound : autoAction;
    return actionAnnotation.make_(adm, key, descriptor, source);
  } // other -> observable
  // Copy props from proto as well, see test:
  // "decorate should work with Object.create"


  var observableAnnotation = ((_this$options_3 = this.options_) == null ? void 0 : _this$options_3.deep) === false ? observable.ref : observable; // if function respect autoBind option

  if (typeof descriptor.value === "function" && (_this$options_4 = this.options_) != null && _this$options_4.autoBind) {
    var _adm$proxy_;

    descriptor.value = descriptor.value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }

  return observableAnnotation.make_(adm, key, descriptor, source);
}

function extend_$5(adm, key, descriptor, proxyTrap) {
  var _this$options_5, _this$options_6;

  // getter -> computed
  if (descriptor.get) {
    return computed.extend_(adm, key, descriptor, proxyTrap);
  } // lone setter -> action setter


  if (descriptor.set) {
    // TODO make action applicable to setter and delegate to action.extend_
    return adm.defineProperty_(key, {
      configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
      set: createAction(key.toString(), descriptor.set)
    }, proxyTrap);
  } // other -> observable
  // if function respect autoBind option


  if (typeof descriptor.value === "function" && (_this$options_5 = this.options_) != null && _this$options_5.autoBind) {
    var _adm$proxy_2;

    descriptor.value = descriptor.value.bind((_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_);
  }

  var observableAnnotation = ((_this$options_6 = this.options_) == null ? void 0 : _this$options_6.deep) === false ? observable.ref : observable;
  return observableAnnotation.extend_(adm, key, descriptor, proxyTrap);
}

var OBSERVABLE = "observable";
var OBSERVABLE_REF = "observable.ref";
var OBSERVABLE_SHALLOW = "observable.shallow";
var OBSERVABLE_STRUCT = "observable.struct"; // Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases

var defaultCreateObservableOptions = {
  deep: true,
  name: undefined,
  defaultDecorator: undefined,
  proxy: true
};
Object.freeze(defaultCreateObservableOptions);
function asCreateObservableOptions(thing) {
  return thing || defaultCreateObservableOptions;
}
var observableAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE);
var observableRefAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_REF, {
  enhancer: referenceEnhancer
});
var observableShallowAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_SHALLOW, {
  enhancer: shallowEnhancer
});
var observableStructAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_STRUCT, {
  enhancer: refStructEnhancer
});
var observableDecoratorAnnotation = /*#__PURE__*/createDecoratorAnnotation(observableAnnotation);
function getEnhancerFromOptions(options) {
  return options.deep === true ? deepEnhancer : options.deep === false ? referenceEnhancer : getEnhancerFromAnnotation(options.defaultDecorator);
}
function getAnnotationFromOptions(options) {
  var _options$defaultDecor;

  return options ? (_options$defaultDecor = options.defaultDecorator) != null ? _options$defaultDecor : createAutoAnnotation(options) : undefined;
}
function getEnhancerFromAnnotation(annotation) {
  var _annotation$options_$, _annotation$options_;

  return !annotation ? deepEnhancer : (_annotation$options_$ = (_annotation$options_ = annotation.options_) == null ? void 0 : _annotation$options_.enhancer) != null ? _annotation$options_$ : deepEnhancer;
}
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */

function createObservable(v, arg2, arg3) {
  // @observable someProp;
  if (isStringish(arg2)) {
    storeAnnotation(v, arg2, observableAnnotation);
    return;
  } // already observable - ignore


  if (isObservable(v)) {
    return v;
  } // plain object


  if (isPlainObject(v)) {
    return observable.object(v, arg2, arg3);
  } // Array


  if (Array.isArray(v)) {
    return observable.array(v, arg2);
  } // Map


  if (isES6Map(v)) {
    return observable.map(v, arg2);
  } // Set


  if (isES6Set(v)) {
    return observable.set(v, arg2);
  } // other object - ignore


  if (typeof v === "object" && v !== null) {
    return v;
  } // anything else


  return observable.box(v, arg2);
}

Object.assign(createObservable, observableDecoratorAnnotation);
var observableFactories = {
  box: function box(value, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
  },
  array: function array(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return (globalState.useProxies === false || o.proxy === false ? createLegacyArray : createObservableArray)(initialValues, getEnhancerFromOptions(o), o.name);
  },
  map: function map(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
  },
  set: function set(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
  },
  object: function object(props, decorators, options) {
    return extendObservable(globalState.useProxies === false || (options == null ? void 0 : options.proxy) === false ? asObservableObject({}, options) : asDynamicObservableObject({}, options), props, decorators);
  },
  ref: /*#__PURE__*/createDecoratorAnnotation(observableRefAnnotation),
  shallow: /*#__PURE__*/createDecoratorAnnotation(observableShallowAnnotation),
  deep: observableDecoratorAnnotation,
  struct: /*#__PURE__*/createDecoratorAnnotation(observableStructAnnotation)
}; // eslint-disable-next-line

var observable = /*#__PURE__*/assign(createObservable, observableFactories);

var COMPUTED = "computed";
var COMPUTED_STRUCT = "computed.struct";
var computedAnnotation = /*#__PURE__*/createComputedAnnotation(COMPUTED);
var computedStructAnnotation = /*#__PURE__*/createComputedAnnotation(COMPUTED_STRUCT, {
  equals: comparer.structural
});
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */

var computed = function computed(arg1, arg2) {
  if (isStringish(arg2)) {
    // @computed
    return storeAnnotation(arg1, arg2, computedAnnotation);
  }

  if (isPlainObject(arg1)) {
    // @computed({ options })
    return createDecoratorAnnotation(createComputedAnnotation(COMPUTED, arg1));
  } // computed(expr, options?)

  var opts = isPlainObject(arg2) ? arg2 : {};
  opts.get = arg1;
  opts.name || (opts.name = arg1.name || "");
  /* for generated name */

  return new ComputedValue(opts);
};
Object.assign(computed, computedAnnotation);
computed.struct = /*#__PURE__*/createDecoratorAnnotation(computedStructAnnotation);

var _getDescriptor$config, _getDescriptor;
// mobx versions

var currentActionId = 0;
var nextActionId = 1;
var isFunctionNameConfigurable = (_getDescriptor$config = (_getDescriptor = /*#__PURE__*/getDescriptor(function () {}, "name")) == null ? void 0 : _getDescriptor.configurable) != null ? _getDescriptor$config : false; // we can safely recycle this object

var tmpNameDescriptor = {
  value: "action",
  configurable: true,
  writable: false,
  enumerable: false
};
function createAction(actionName, fn, autoAction, ref) {
  if (autoAction === void 0) {
    autoAction = false;
  }

  function res() {
    return executeAction(actionName, autoAction, fn, ref || this, arguments);
  }

  res.isMobxAction = true;

  if (isFunctionNameConfigurable) {
    tmpNameDescriptor.value = actionName;
    Object.defineProperty(res, "name", tmpNameDescriptor);
  }

  return res;
}
function executeAction(actionName, canRunAsDerivation, fn, scope, args) {
  var runInfo = _startAction(actionName, canRunAsDerivation);

  try {
    return fn.apply(scope, args);
  } catch (err) {
    runInfo.error_ = err;
    throw err;
  } finally {
    _endAction(runInfo);
  }
}
function _startAction(actionName, canRunAsDerivation, // true for autoAction
scope, args) {
  var notifySpy_ = "production" !== "production"  ;
  var startTime_ = 0;

  var prevDerivation_ = globalState.trackingDerivation;
  var runAsAction = !canRunAsDerivation || !prevDerivation_;
  startBatch();
  var prevAllowStateChanges_ = globalState.allowStateChanges; // by default preserve previous allow

  if (runAsAction) {
    untrackedStart();
    prevAllowStateChanges_ = allowStateChangesStart(true);
  }

  var prevAllowStateReads_ = allowStateReadsStart(true);
  var runInfo = {
    runAsAction_: runAsAction,
    prevDerivation_: prevDerivation_,
    prevAllowStateChanges_: prevAllowStateChanges_,
    prevAllowStateReads_: prevAllowStateReads_,
    notifySpy_: notifySpy_,
    startTime_: startTime_,
    actionId_: nextActionId++,
    parentActionId_: currentActionId
  };
  currentActionId = runInfo.actionId_;
  return runInfo;
}
function _endAction(runInfo) {
  if (currentActionId !== runInfo.actionId_) {
    die(30);
  }

  currentActionId = runInfo.parentActionId_;

  if (runInfo.error_ !== undefined) {
    globalState.suppressReactionErrors = true;
  }

  allowStateChangesEnd(runInfo.prevAllowStateChanges_);
  allowStateReadsEnd(runInfo.prevAllowStateReads_);
  endBatch();

  if (runInfo.runAsAction_) {
    untrackedEnd(runInfo.prevDerivation_);
  }

  globalState.suppressReactionErrors = false;
}
function allowStateChanges(allowStateChanges, func) {
  var prev = allowStateChangesStart(allowStateChanges);

  try {
    return func();
  } finally {
    allowStateChangesEnd(prev);
  }
}
function allowStateChangesStart(allowStateChanges) {
  var prev = globalState.allowStateChanges;
  globalState.allowStateChanges = allowStateChanges;
  return prev;
}
function allowStateChangesEnd(prev) {
  globalState.allowStateChanges = prev;
}

var _Symbol$toPrimitive;
_Symbol$toPrimitive = Symbol.toPrimitive;
var ObservableValue = /*#__PURE__*/function (_Atom) {
  _inheritsLoose(ObservableValue, _Atom);

  function ObservableValue(value, enhancer, name_, notifySpy, equals) {
    var _this;

    if (name_ === void 0) {
      name_ = "ObservableValue";
    }

    if (notifySpy === void 0) {
      notifySpy = true;
    }

    if (equals === void 0) {
      equals = comparer["default"];
    }

    _this = _Atom.call(this, name_) || this;
    _this.enhancer = void 0;
    _this.name_ = void 0;
    _this.equals = void 0;
    _this.hasUnreportedChange_ = false;
    _this.interceptors_ = void 0;
    _this.changeListeners_ = void 0;
    _this.value_ = void 0;
    _this.dehancer = void 0;
    _this.enhancer = enhancer;
    _this.name_ = name_;
    _this.equals = equals;
    _this.value_ = enhancer(value, undefined, name_);

    return _this;
  }

  var _proto = ObservableValue.prototype;

  _proto.dehanceValue = function dehanceValue(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.set = function set(newValue) {
    this.value_;
    newValue = this.prepareNewValue_(newValue);

    if (newValue !== globalState.UNCHANGED) {

      this.setNewValue_(newValue);
    }
  };

  _proto.prepareNewValue_ = function prepareNewValue_(newValue) {

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this,
        type: UPDATE,
        newValue: newValue
      });

      if (!change) {
        return globalState.UNCHANGED;
      }

      newValue = change.newValue;
    } // apply modifier


    newValue = this.enhancer(newValue, this.value_, this.name_);
    return this.equals(this.value_, newValue) ? globalState.UNCHANGED : newValue;
  };

  _proto.setNewValue_ = function setNewValue_(newValue) {
    var oldValue = this.value_;
    this.value_ = newValue;
    this.reportChanged();

    if (hasListeners(this)) {
      notifyListeners(this, {
        type: UPDATE,
        object: this,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };

  _proto.get = function get() {
    this.reportObserved();
    return this.dehanceValue(this.value_);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately) {
      listener({
        observableKind: "value",
        debugObjectName: this.name_,
        object: this,
        type: UPDATE,
        newValue: this.value_,
        oldValue: undefined
      });
    }

    return registerListener(this, listener);
  };

  _proto.raw = function raw() {
    // used by MST ot get undehanced value
    return this.value_;
  };

  _proto.toJSON = function toJSON() {
    return this.get();
  };

  _proto.toString = function toString() {
    return this.name_ + "[" + this.value_ + "]";
  };

  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };

  _proto[_Symbol$toPrimitive] = function () {
    return this.valueOf();
  };

  return ObservableValue;
}(Atom);

var _Symbol$toPrimitive$1;
/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */

_Symbol$toPrimitive$1 = Symbol.toPrimitive;
var ComputedValue = /*#__PURE__*/function () {
  // nodes we are looking at. Our value depends on these nodes
  // during tracking it's an array with new observed observers
  // to check for cycles
  // N.B: unminified as it is used by MST

  /**
   * Create a new computed value based on a function expression.
   *
   * The `name` property is for debug purposes only.
   *
   * The `equals` property specifies the comparer function to use to determine if a newly produced
   * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
   * compares based on identity comparison (===), and `structuralComparer` deeply compares the structure.
   * Structural comparison can be convenient if you always produce a new aggregated object and
   * don't want to notify observers if it is structurally the same.
   * This is useful for working with vectors, mouse coordinates etc.
   */
  function ComputedValue(options) {
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.observing_ = [];
    this.newObserving_ = null;
    this.isBeingObserved_ = false;
    this.isPendingUnobservation_ = false;
    this.observers_ = new Set();
    this.diffValue_ = 0;
    this.runId_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    this.unboundDepsCount_ = 0;
    this.value_ = new CaughtException(null);
    this.name_ = void 0;
    this.triggeredBy_ = void 0;
    this.isComputing_ = false;
    this.isRunningSetter_ = false;
    this.derivation = void 0;
    this.setter_ = void 0;
    this.isTracing_ = TraceMode.NONE;
    this.scope_ = void 0;
    this.equals_ = void 0;
    this.requiresReaction_ = void 0;
    this.keepAlive_ = void 0;
    this.onBOL = void 0;
    this.onBUOL = void 0;

    if (!options.get) {
      die(31);
    }

    this.derivation = options.get;
    this.name_ = options.name || ("ComputedValue");

    if (options.set) {
      this.setter_ = createAction("ComputedValue-setter", options.set);
    }

    this.equals_ = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer["default"]);
    this.scope_ = options.context;
    this.requiresReaction_ = options.requiresReaction;
    this.keepAlive_ = !!options.keepAlive;
  }

  var _proto = ComputedValue.prototype;

  _proto.onBecomeStale_ = function onBecomeStale_() {
    propagateMaybeChanged(this);
  };

  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function (listener) {
        return listener();
      });
    }
  };

  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function (listener) {
        return listener();
      });
    }
  }
  /**
   * Returns the current value of this computed value.
   * Will evaluate its computation first if needed.
   */
  ;

  _proto.get = function get() {
    if (this.isComputing_) {
      die(32, this.name_, this.derivation);
    }

    if (globalState.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_) {
      if (shouldCompute(this)) {
        this.warnAboutUntrackedRead_();
        startBatch(); // See perf test 'computed memoization'

        this.value_ = this.computeValue_(false);
        endBatch();
      }
    } else {
      reportObserved(this);

      if (shouldCompute(this)) {
        var prevTrackingContext = globalState.trackingContext;

        if (this.keepAlive_ && !prevTrackingContext) {
          globalState.trackingContext = this;
        }

        if (this.trackAndCompute()) {
          propagateChangeConfirmed(this);
        }

        globalState.trackingContext = prevTrackingContext;
      }
    }

    var result = this.value_;

    if (isCaughtException(result)) {
      throw result.cause;
    }

    return result;
  };

  _proto.set = function set(value) {
    if (this.setter_) {
      if (this.isRunningSetter_) {
        die(33, this.name_);
      }

      this.isRunningSetter_ = true;

      try {
        this.setter_.call(this.scope_, value);
      } finally {
        this.isRunningSetter_ = false;
      }
    } else {
      die(34, this.name_);
    }
  };

  _proto.trackAndCompute = function trackAndCompute() {
    // N.B: unminified as it is used by MST
    var oldValue = this.value_;
    var wasSuspended =
    /* see #1208 */
    this.dependenciesState_ === IDerivationState_.NOT_TRACKING_;
    var newValue = this.computeValue_(true);
    var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals_(oldValue, newValue);

    if (changed) {
      this.value_ = newValue;
    }

    return changed;
  };

  _proto.computeValue_ = function computeValue_(track) {
    this.isComputing_ = true; // don't allow state changes during computation

    var prev = allowStateChangesStart(false);
    var res;

    if (track) {
      res = trackDerivedFunction(this, this.derivation, this.scope_);
    } else {
      if (globalState.disableErrorBoundaries === true) {
        res = this.derivation.call(this.scope_);
      } else {
        try {
          res = this.derivation.call(this.scope_);
        } catch (e) {
          res = new CaughtException(e);
        }
      }
    }

    allowStateChangesEnd(prev);
    this.isComputing_ = false;
    return res;
  };

  _proto.suspend_ = function suspend_() {
    if (!this.keepAlive_) {
      clearObserving(this);
      this.value_ = undefined; // don't hold on to computed value!
    }
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    var _this = this;

    var firstTime = true;
    var prevValue = undefined;
    return autorun(function () {
      // TODO: why is this in a different place than the spyReport() function? in all other observables it's called in the same place
      var newValue = _this.get();

      if (!firstTime || fireImmediately) {
        var prevU = untrackedStart();
        listener({
          observableKind: "computed",
          debugObjectName: _this.name_,
          type: UPDATE,
          object: _this,
          newValue: newValue,
          oldValue: prevValue
        });
        untrackedEnd(prevU);
      }

      firstTime = false;
      prevValue = newValue;
    });
  };

  _proto.warnAboutUntrackedRead_ = function warnAboutUntrackedRead_() {
    {
      return;
    }
  };

  _proto.toString = function toString() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  };

  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };

  _proto[_Symbol$toPrimitive$1] = function () {
    return this.valueOf();
  };

  return ComputedValue;
}();
var isComputedValue = /*#__PURE__*/createInstanceofPredicate("ComputedValue", ComputedValue);

var IDerivationState_;

(function (IDerivationState_) {
  // before being run or (outside batch and not being observed)
  // at this point derivation is not holding any data about dependency tree
  IDerivationState_[IDerivationState_["NOT_TRACKING_"] = -1] = "NOT_TRACKING_"; // no shallow dependency changed since last computation
  // won't recalculate derivation
  // this is what makes mobx fast

  IDerivationState_[IDerivationState_["UP_TO_DATE_"] = 0] = "UP_TO_DATE_"; // some deep dependency changed, but don't know if shallow dependency changed
  // will require to check first if UP_TO_DATE or POSSIBLY_STALE
  // currently only ComputedValue will propagate POSSIBLY_STALE
  //
  // having this state is second big optimization:
  // don't have to recompute on every dependency change, but only when it's needed

  IDerivationState_[IDerivationState_["POSSIBLY_STALE_"] = 1] = "POSSIBLY_STALE_"; // A shallow dependency has changed since last computation and the derivation
  // will need to recompute when it's needed next.

  IDerivationState_[IDerivationState_["STALE_"] = 2] = "STALE_";
})(IDerivationState_ || (IDerivationState_ = {}));

var TraceMode;

(function (TraceMode) {
  TraceMode[TraceMode["NONE"] = 0] = "NONE";
  TraceMode[TraceMode["LOG"] = 1] = "LOG";
  TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));

var CaughtException = function CaughtException(cause) {
  this.cause = void 0;
  this.cause = cause; // Empty
};
function isCaughtException(e) {
  return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */

function shouldCompute(derivation) {
  switch (derivation.dependenciesState_) {
    case IDerivationState_.UP_TO_DATE_:
      return false;

    case IDerivationState_.NOT_TRACKING_:
    case IDerivationState_.STALE_:
      return true;

    case IDerivationState_.POSSIBLY_STALE_:
      {
        // state propagation can occur outside of action/reactive context #2195
        var prevAllowStateReads = allowStateReadsStart(true);
        var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.

        var obs = derivation.observing_,
            l = obs.length;

        for (var i = 0; i < l; i++) {
          var obj = obs[i];

          if (isComputedValue(obj)) {
            if (globalState.disableErrorBoundaries) {
              obj.get();
            } else {
              try {
                obj.get();
              } catch (e) {
                // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                untrackedEnd(prevUntracked);
                allowStateReadsEnd(prevAllowStateReads);
                return true;
              }
            } // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
            // and `derivation` is an observer of `obj`
            // invariantShouldCompute(derivation)


            if (derivation.dependenciesState_ === IDerivationState_.STALE_) {
              untrackedEnd(prevUntracked);
              allowStateReadsEnd(prevAllowStateReads);
              return true;
            }
          }
        }

        changeDependenciesStateTo0(derivation);
        untrackedEnd(prevUntracked);
        allowStateReadsEnd(prevAllowStateReads);
        return false;
      }
  }
}
function checkIfStateModificationsAreAllowed(atom) {
  {
    return;
  }
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */

function trackDerivedFunction(derivation, f, context) {
  var prevAllowStateReads = allowStateReadsStart(true); // pre allocate array allocation + room for variation in deps
  // array will be trimmed by bindDependencies

  changeDependenciesStateTo0(derivation);
  derivation.newObserving_ = new Array(derivation.observing_.length + 100);
  derivation.unboundDepsCount_ = 0;
  derivation.runId_ = ++globalState.runId;
  var prevTracking = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  globalState.inBatch++;
  var result;

  if (globalState.disableErrorBoundaries === true) {
    result = f.call(context);
  } else {
    try {
      result = f.call(context);
    } catch (e) {
      result = new CaughtException(e);
    }
  }

  globalState.inBatch--;
  globalState.trackingDerivation = prevTracking;
  bindDependencies(derivation);
  allowStateReadsEnd(prevAllowStateReads);
  return result;
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */


function bindDependencies(derivation) {
  // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
  var prevObserving = derivation.observing_;
  var observing = derivation.observing_ = derivation.newObserving_;
  var lowestNewObservingDerivationState = IDerivationState_.UP_TO_DATE_; // Go through all new observables and check diffValue: (this list can contain duplicates):
  //   0: first occurrence, change to 1 and keep it
  //   1: extra occurrence, drop it

  var i0 = 0,
      l = derivation.unboundDepsCount_;

  for (var i = 0; i < l; i++) {
    var dep = observing[i];

    if (dep.diffValue_ === 0) {
      dep.diffValue_ = 1;

      if (i0 !== i) {
        observing[i0] = dep;
      }

      i0++;
    } // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
    // not hitting the condition


    if (dep.dependenciesState_ > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = dep.dependenciesState_;
    }
  }

  observing.length = i0;
  derivation.newObserving_ = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
  // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
  //   0: it's not in new observables, unobserve it
  //   1: it keeps being observed, don't want to notify it. change to 0

  l = prevObserving.length;

  while (l--) {
    var _dep = prevObserving[l];

    if (_dep.diffValue_ === 0) {
      removeObserver(_dep, derivation);
    }

    _dep.diffValue_ = 0;
  } // Go through all new observables and check diffValue: (now it should be unique)
  //   0: it was set to 0 in last loop. don't need to do anything.
  //   1: it wasn't observed, let's observe it. set back to 0


  while (i0--) {
    var _dep2 = observing[i0];

    if (_dep2.diffValue_ === 1) {
      _dep2.diffValue_ = 0;
      addObserver(_dep2, derivation);
    }
  } // Some new observed derivations may become stale during this derivation computation
  // so they have had no chance to propagate staleness (#916)


  if (lowestNewObservingDerivationState !== IDerivationState_.UP_TO_DATE_) {
    derivation.dependenciesState_ = lowestNewObservingDerivationState;
    derivation.onBecomeStale_();
  }
}

function clearObserving(derivation) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
  var obs = derivation.observing_;
  derivation.observing_ = [];
  var i = obs.length;

  while (i--) {
    removeObserver(obs[i], derivation);
  }

  derivation.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
}
function untracked(action) {
  var prev = untrackedStart();

  try {
    return action();
  } finally {
    untrackedEnd(prev);
  }
}
function untrackedStart() {
  var prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}
function untrackedEnd(prev) {
  globalState.trackingDerivation = prev;
}
function allowStateReadsStart(allowStateReads) {
  var prev = globalState.allowStateReads;
  globalState.allowStateReads = allowStateReads;
  return prev;
}
function allowStateReadsEnd(prev) {
  globalState.allowStateReads = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */

function changeDependenciesStateTo0(derivation) {
  if (derivation.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
    return;
  }

  derivation.dependenciesState_ = IDerivationState_.UP_TO_DATE_;
  var obs = derivation.observing_;
  var i = obs.length;

  while (i--) {
    obs[i].lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
  }
}
var MobXGlobals = function MobXGlobals() {
  this.version = 6;
  this.UNCHANGED = {};
  this.trackingDerivation = null;
  this.trackingContext = null;
  this.runId = 0;
  this.mobxGuid = 0;
  this.inBatch = 0;
  this.pendingUnobservations = [];
  this.pendingReactions = [];
  this.isRunningReactions = false;
  this.allowStateChanges = false;
  this.allowStateReads = true;
  this.enforceActions = true;
  this.spyListeners = [];
  this.globalReactionErrorHandlers = [];
  this.computedRequiresReaction = false;
  this.reactionRequiresObservable = false;
  this.observableRequiresReaction = false;
  this.disableErrorBoundaries = false;
  this.suppressReactionErrors = false;
  this.useProxies = true;
  this.verifyProxies = false;
  this.safeDescriptors = true;
};
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = /*#__PURE__*/function () {
  var global = /*#__PURE__*/getGlobal();

  if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals) {
    canMergeGlobalState = false;
  }

  if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version) {
    canMergeGlobalState = false;
  }

  if (!canMergeGlobalState) {
    // Because this is a IIFE we need to let isolateCalled a chance to change
    // so we run it after the event loop completed at least 1 iteration
    setTimeout(function () {
      if (!isolateCalled) {
        die(35);
      }
    }, 1);
    return new MobXGlobals();
  } else if (global.__mobxGlobals) {
    global.__mobxInstanceCount += 1;

    if (!global.__mobxGlobals.UNCHANGED) {
      global.__mobxGlobals.UNCHANGED = {};
    } // make merge backward compatible


    return global.__mobxGlobals;
  } else {
    global.__mobxInstanceCount = 1;
    return global.__mobxGlobals = /*#__PURE__*/new MobXGlobals();
  }
}();
function isolateGlobalState() {
  if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) {
    die(36);
  }

  isolateCalled = true;

  if (canMergeGlobalState) {
    var global = getGlobal();

    if (--global.__mobxInstanceCount === 0) {
      global.__mobxGlobals = undefined;
    }

    globalState = new MobXGlobals();
  }
}
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }

function addObserver(observable, node) {
  // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
  // invariantObservers(observable);
  observable.observers_.add(node);

  if (observable.lowestObserverState_ > node.dependenciesState_) {
    observable.lowestObserverState_ = node.dependenciesState_;
  } // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");

}
function removeObserver(observable, node) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
  // invariantObservers(observable);
  observable.observers_["delete"](node);

  if (observable.observers_.size === 0) {
    // deleting last observer
    queueForUnobservation(observable);
  } // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");

}
function queueForUnobservation(observable) {
  if (observable.isPendingUnobservation_ === false) {
    // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
    observable.isPendingUnobservation_ = true;
    globalState.pendingUnobservations.push(observable);
  }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */

function startBatch() {
  globalState.inBatch++;
}
function endBatch() {
  if (--globalState.inBatch === 0) {
    runReactions(); // the batch is actually about to finish, all unobserving should happen here.

    var list = globalState.pendingUnobservations;

    for (var i = 0; i < list.length; i++) {
      var observable = list[i];
      observable.isPendingUnobservation_ = false;

      if (observable.observers_.size === 0) {
        if (observable.isBeingObserved_) {
          // if this observable had reactive observers, trigger the hooks
          observable.isBeingObserved_ = false;
          observable.onBUO();
        }

        if (observable instanceof ComputedValue) {
          // computed values are automatically teared down when the last observer leaves
          // this process happens recursively, this computed might be the last observabe of another, etc..
          observable.suspend_();
        }
      }
    }

    globalState.pendingUnobservations = [];
  }
}
function reportObserved(observable) {
  var derivation = globalState.trackingDerivation;

  if (derivation !== null) {
    /**
     * Simple optimization, give each derivation run an unique id (runId)
     * Check if last time this observable was accessed the same runId is used
     * if this is the case, the relation is already known
     */
    if (derivation.runId_ !== observable.lastAccessedBy_) {
      observable.lastAccessedBy_ = derivation.runId_; // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...

      derivation.newObserving_[derivation.unboundDepsCount_++] = observable;

      if (!observable.isBeingObserved_ && globalState.trackingContext) {
        observable.isBeingObserved_ = true;
        observable.onBO();
      }
    }

    return true;
  } else if (observable.observers_.size === 0 && globalState.inBatch > 0) {
    queueForUnobservation(observable);
  }

  return false;
} // function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }

/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes

function propagateChanged(observable) {
  // invariantLOS(observable, "changed start");
  if (observable.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }

  observable.lowestObserverState_ = IDerivationState_.STALE_; // Ideally we use for..of here, but the downcompiled version is really slow...

  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {

      d.onBecomeStale_();
    }

    d.dependenciesState_ = IDerivationState_.STALE_;
  }); // invariantLOS(observable, "changed end");
} // Called by ComputedValue when it recalculate and its value changed

function propagateChangeConfirmed(observable) {
  // invariantLOS(observable, "confirmed start");
  if (observable.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }

  observable.lowestObserverState_ = IDerivationState_.STALE_;
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.POSSIBLY_STALE_) {
      d.dependenciesState_ = IDerivationState_.STALE_;
    } else if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_ // this happens during computing of `d`, just keep lowestObserverState up to date.
    ) {
      observable.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    }
  }); // invariantLOS(observable, "confirmed end");
} // Used by computed when its dependency changed, but we don't wan't to immediately recompute.

function propagateMaybeChanged(observable) {
  // invariantLOS(observable, "maybe start");
  if (observable.lowestObserverState_ !== IDerivationState_.UP_TO_DATE_) {
    return;
  }

  observable.lowestObserverState_ = IDerivationState_.POSSIBLY_STALE_;
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      d.dependenciesState_ = IDerivationState_.POSSIBLY_STALE_;
      d.onBecomeStale_();
    }
  }); // invariantLOS(observable, "maybe end");
}

var Reaction = /*#__PURE__*/function () {
  // nodes we are looking at. Our value depends on these nodes
  function Reaction(name_, onInvalidate_, errorHandler_, requiresObservable_) {
    if (name_ === void 0) {
      name_ = "Reaction";
    }

    this.name_ = void 0;
    this.onInvalidate_ = void 0;
    this.errorHandler_ = void 0;
    this.requiresObservable_ = void 0;
    this.observing_ = [];
    this.newObserving_ = [];
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.diffValue_ = 0;
    this.runId_ = 0;
    this.unboundDepsCount_ = 0;
    this.isDisposed_ = false;
    this.isScheduled_ = false;
    this.isTrackPending_ = false;
    this.isRunning_ = false;
    this.isTracing_ = TraceMode.NONE;
    this.name_ = name_;
    this.onInvalidate_ = onInvalidate_;
    this.errorHandler_ = errorHandler_;
    this.requiresObservable_ = requiresObservable_;
  }

  var _proto = Reaction.prototype;

  _proto.onBecomeStale_ = function onBecomeStale_() {
    this.schedule_();
  };

  _proto.schedule_ = function schedule_() {
    if (!this.isScheduled_) {
      this.isScheduled_ = true;
      globalState.pendingReactions.push(this);
      runReactions();
    }
  };

  _proto.isScheduled = function isScheduled() {
    return this.isScheduled_;
  }
  /**
   * internal, use schedule() if you intend to kick off a reaction
   */
  ;

  _proto.runReaction_ = function runReaction_() {
    if (!this.isDisposed_) {
      startBatch();
      this.isScheduled_ = false;
      var prev = globalState.trackingContext;
      globalState.trackingContext = this;

      if (shouldCompute(this)) {
        this.isTrackPending_ = true;

        try {
          this.onInvalidate_();

          if ("production" !== "production" && this.isTrackPending_ && isSpyEnabled()) ;
        } catch (e) {
          this.reportExceptionInDerivation_(e);
        }
      }

      globalState.trackingContext = prev;
      endBatch();
    }
  };

  _proto.track = function track(fn) {
    if (this.isDisposed_) {
      return; // console.warn("Reaction already disposed") // Note: Not a warning / error in mobx 4 either
    }

    startBatch();

    this.isRunning_ = true;
    var prevReaction = globalState.trackingContext; // reactions could create reactions...

    globalState.trackingContext = this;
    var result = trackDerivedFunction(this, fn, undefined);
    globalState.trackingContext = prevReaction;
    this.isRunning_ = false;
    this.isTrackPending_ = false;

    if (this.isDisposed_) {
      // disposed during last run. Clean up everything that was bound after the dispose call.
      clearObserving(this);
    }

    if (isCaughtException(result)) {
      this.reportExceptionInDerivation_(result.cause);
    }

    endBatch();
  };

  _proto.reportExceptionInDerivation_ = function reportExceptionInDerivation_(error) {
    var _this = this;

    if (this.errorHandler_) {
      this.errorHandler_(error, this);
      return;
    }

    if (globalState.disableErrorBoundaries) {
      throw error;
    }

    var message = "[mobx] uncaught error in '" + this + "'";

    if (!globalState.suppressReactionErrors) {
      console.error(message, error);
      /** If debugging brought you here, please, read the above message :-). Tnx! */
    } // prettier-ignore

    globalState.globalReactionErrorHandlers.forEach(function (f) {
      return f(error, _this);
    });
  };

  _proto.dispose = function dispose() {
    if (!this.isDisposed_) {
      this.isDisposed_ = true;

      if (!this.isRunning_) {
        // if disposed while running, clean up later. Maybe not optimal, but rare case
        startBatch();
        clearObserving(this);
        endBatch();
      }
    }
  };

  _proto.getDisposer_ = function getDisposer_() {
    var r = this.dispose.bind(this);
    r[$mobx] = this;
    return r;
  };

  _proto.toString = function toString() {
    return "Reaction[" + this.name_ + "]";
  };

  _proto.trace = function trace$1(enterBreakPoint) {
    if (enterBreakPoint === void 0) {
      enterBreakPoint = false;
    }

    trace(this, enterBreakPoint);
  };

  return Reaction;
}();
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */

var MAX_REACTION_ITERATIONS = 100;

var reactionScheduler = function reactionScheduler(f) {
  return f();
};

function runReactions() {
  // Trampolining, if runReactions are already running, new reactions will be picked up
  if (globalState.inBatch > 0 || globalState.isRunningReactions) {
    return;
  }

  reactionScheduler(runReactionsHelper);
}

function runReactionsHelper() {
  globalState.isRunningReactions = true;
  var allReactions = globalState.pendingReactions;
  var iterations = 0; // While running reactions, new reactions might be triggered.
  // Hence we work with two variables and check whether
  // we converge to no remaining reactions after a while.

  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error("[mobx] cycle in reaction: " + allReactions[0]);
      allReactions.splice(0); // clear reactions
    }

    var remainingReactions = allReactions.splice(0);

    for (var i = 0, l = remainingReactions.length; i < l; i++) {
      remainingReactions[i].runReaction_();
    }
  }

  globalState.isRunningReactions = false;
}

var isReaction = /*#__PURE__*/createInstanceofPredicate("Reaction", Reaction);
function setReactionScheduler(fn) {
  var baseScheduler = reactionScheduler;

  reactionScheduler = function reactionScheduler(f) {
    return fn(function () {
      return baseScheduler(f);
    });
  };
}

function isSpyEnabled() {
  return "production" !== "production" ;
}
function spyReport(event) {
  {
    return;
  } // dead code elimination can do the rest
}
function spyReportStart(event) {
  {
    return;
  }
}
function spyReportEnd(change) {
  {
    return;
  }
}
function spy(listener) {
  {
    console.warn("[mobx.spy] Is a no-op in production builds");
    return function () {};
  }
}

var ACTION = "action";
var ACTION_BOUND = "action.bound";
var AUTOACTION = "autoAction";
var AUTOACTION_BOUND = "autoAction.bound";
var DEFAULT_ACTION_NAME = "<unnamed action>";
var actionAnnotation = /*#__PURE__*/createActionAnnotation(ACTION);
var actionBoundAnnotation = /*#__PURE__*/createActionAnnotation(ACTION_BOUND, {
  bound: true
});
var autoActionAnnotation = /*#__PURE__*/createActionAnnotation(AUTOACTION, {
  autoAction: true
});
var autoActionBoundAnnotation = /*#__PURE__*/createActionAnnotation(AUTOACTION_BOUND, {
  autoAction: true,
  bound: true
});

function createActionFactory(autoAction) {
  var res = function action(arg1, arg2) {
    // action(fn() {})
    if (isFunction(arg1)) {
      return createAction(arg1.name || DEFAULT_ACTION_NAME, arg1, autoAction);
    } // action("name", fn() {})


    if (isFunction(arg2)) {
      return createAction(arg1, arg2, autoAction);
    } // @action


    if (isStringish(arg2)) {
      return storeAnnotation(arg1, arg2, autoAction ? autoActionAnnotation : actionAnnotation);
    } // action("name") & @action("name")


    if (isStringish(arg1)) {
      return createDecoratorAnnotation(createActionAnnotation(autoAction ? AUTOACTION : ACTION, {
        name: arg1,
        autoAction: autoAction
      }));
    }
  };

  return res;
}

var action = /*#__PURE__*/createActionFactory(false);
Object.assign(action, actionAnnotation);
var autoAction = /*#__PURE__*/createActionFactory(true);
Object.assign(autoAction, autoActionAnnotation);
action.bound = /*#__PURE__*/createDecoratorAnnotation(actionBoundAnnotation);
autoAction.bound = /*#__PURE__*/createDecoratorAnnotation(autoActionBoundAnnotation);
function isAction(thing) {
  return isFunction(thing) && thing.isMobxAction === true;
}

/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */

function autorun(view, opts) {
  var _opts$name, _opts;

  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }

  var name = (_opts$name = (_opts = opts) == null ? void 0 : _opts.name) != null ? _opts$name : "Autorun";
  var runSync = !opts.scheduler && !opts.delay;
  var reaction;

  if (runSync) {
    // normal autorun
    reaction = new Reaction(name, function () {
      this.track(reactionRunner);
    }, opts.onError, opts.requiresObservable);
  } else {
    var scheduler = createSchedulerFromOptions(opts); // debounced autorun

    var isScheduled = false;
    reaction = new Reaction(name, function () {
      if (!isScheduled) {
        isScheduled = true;
        scheduler(function () {
          isScheduled = false;

          if (!reaction.isDisposed_) {
            reaction.track(reactionRunner);
          }
        });
      }
    }, opts.onError, opts.requiresObservable);
  }

  function reactionRunner() {
    view(reaction);
  }

  reaction.schedule_();
  return reaction.getDisposer_();
}

var run = function run(f) {
  return f();
};

function createSchedulerFromOptions(opts) {
  return opts.scheduler ? opts.scheduler : opts.delay ? function (f) {
    return setTimeout(f, opts.delay);
  } : run;
}

var ON_BECOME_OBSERVED = "onBO";
var ON_BECOME_UNOBSERVED = "onBUO";
function onBecomeObserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_OBSERVED, thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_UNOBSERVED, thing, arg2, arg3);
}

function interceptHook(hook, thing, arg2, arg3) {
  var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
  var cb = isFunction(arg3) ? arg3 : arg2;
  var listenersKey = hook + "L";

  if (atom[listenersKey]) {
    atom[listenersKey].add(cb);
  } else {
    atom[listenersKey] = new Set([cb]);
  }

  return function () {
    var hookListeners = atom[listenersKey];

    if (hookListeners) {
      hookListeners["delete"](cb);

      if (hookListeners.size === 0) {
        delete atom[listenersKey];
      }
    }
  };
}

var NEVER = "never";
var ALWAYS = "always";
var OBSERVED = "observed"; // const IF_AVAILABLE = "ifavailable"

function configure(options) {
  if (options.isolateGlobalState === true) {
    isolateGlobalState();
  }

  var useProxies = options.useProxies,
      enforceActions = options.enforceActions;

  if (useProxies !== undefined) {
    globalState.useProxies = useProxies === ALWAYS ? true : useProxies === NEVER ? false : typeof Proxy !== "undefined";
  }

  if (useProxies === "ifavailable") {
    globalState.verifyProxies = true;
  }

  if (enforceActions !== undefined) {
    var ea = enforceActions === ALWAYS ? ALWAYS : enforceActions === OBSERVED;
    globalState.enforceActions = ea;
    globalState.allowStateChanges = ea === true || ea === ALWAYS ? false : true;
  }
  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function (key) {
    if (key in options) {
      globalState[key] = !!options[key];
    }
  });
  globalState.allowStateReads = !globalState.observableRequiresReaction;

  if (options.reactionScheduler) {
    setReactionScheduler(options.reactionScheduler);
  }
}

function extendObservable(target, properties, annotations, options) {


  var descriptors = getOwnPropertyDescriptors(properties);
  var adm = asObservableObject(target, options)[$mobx];
  startBatch();

  try {
    ownKeys(descriptors).forEach(function (key) {
      adm.extend_(key, descriptors[key], // must pass "undefined" for { key: undefined }
      !annotations ? true : key in annotations ? annotations[key] : true);
    });
  } finally {
    endBatch();
  }

  return target;
}

function getDependencyTree(thing, property) {
  return nodeToDependencyTree(getAtom(thing, property));
}

function nodeToDependencyTree(node) {
  var result = {
    name: node.name_
  };

  if (node.observing_ && node.observing_.length > 0) {
    result.dependencies = unique(node.observing_).map(nodeToDependencyTree);
  }

  return result;
}

function unique(list) {
  return Array.from(new Set(list));
}

var generatorId = 0;
function FlowCancellationError() {
  this.message = "FLOW_CANCELLED";
}
FlowCancellationError.prototype = /*#__PURE__*/Object.create(Error.prototype);
var flowAnnotation = /*#__PURE__*/createFlowAnnotation("flow");
var flowBoundAnnotation = /*#__PURE__*/createFlowAnnotation("flow.bound", {
  bound: true
});
var flow = /*#__PURE__*/Object.assign(function flow(arg1, arg2) {
  // @flow
  if (isStringish(arg2)) {
    return storeAnnotation(arg1, arg2, flowAnnotation);
  } // flow(fn)

  var generator = arg1;
  var name = generator.name || "<unnamed flow>"; // Implementation based on https://github.com/tj/co/blob/master/index.js

  var res = function res() {
    var ctx = this;
    var args = arguments;
    var runId = ++generatorId;
    var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
    var rejector;
    var pendingPromise = undefined;
    var promise = new Promise(function (resolve, reject) {
      var stepId = 0;
      rejector = reject;

      function onFulfilled(res) {
        pendingPromise = undefined;
        var ret;

        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
        } catch (e) {
          return reject(e);
        }

        next(ret);
      }

      function onRejected(err) {
        pendingPromise = undefined;
        var ret;

        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen["throw"]).call(gen, err);
        } catch (e) {
          return reject(e);
        }

        next(ret);
      }

      function next(ret) {
        if (isFunction(ret == null ? void 0 : ret.then)) {
          // an async iterator
          ret.then(next, reject);
          return;
        }

        if (ret.done) {
          return resolve(ret.value);
        }

        pendingPromise = Promise.resolve(ret.value);
        return pendingPromise.then(onFulfilled, onRejected);
      }

      onFulfilled(undefined); // kick off the process
    });
    promise.cancel = action(name + " - runid: " + runId + " - cancel", function () {
      try {
        if (pendingPromise) {
          cancelPromise(pendingPromise);
        } // Finally block can return (or yield) stuff..


        var _res = gen["return"](undefined); // eat anything that promise would do, it's cancelled!


        var yieldedPromise = Promise.resolve(_res.value);
        yieldedPromise.then(noop, noop);
        cancelPromise(yieldedPromise); // maybe it can be cancelled :)
        // reject our original promise

        rejector(new FlowCancellationError());
      } catch (e) {
        rejector(e); // there could be a throwing finally block
      }
    });
    return promise;
  };

  res.isMobXFlow = true;
  return res;
}, flowAnnotation);
flow.bound = /*#__PURE__*/createDecoratorAnnotation(flowBoundAnnotation);

function cancelPromise(promise) {
  if (isFunction(promise.cancel)) {
    promise.cancel();
  }
}
function isFlow(fn) {
  return (fn == null ? void 0 : fn.isMobXFlow) === true;
}

function _isObservable(value, property) {
  if (!value) {
    return false;
  }

  if (property !== undefined) {

    if (isObservableObject(value)) {
      return value[$mobx].values_.has(property);
    }

    return false;
  } // For first check, see #701


  return isObservableObject(value) || !!value[$mobx] || isAtom(value) || isReaction(value) || isComputedValue(value);
}

function isObservable(value) {

  return _isObservable(value);
}

function trace() {
  {
    die("trace() is not available in production builds");
  }

  var enterBreakPoint = false;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (typeof args[args.length - 1] === "boolean") {
    enterBreakPoint = args.pop();
  }

  var derivation = getAtomFromArgs(args);

  if (!derivation) {
    return die("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  }

  if (derivation.isTracing_ === TraceMode.NONE) {
    console.log("[mobx.trace] '" + derivation.name_ + "' tracing enabled");
  }

  derivation.isTracing_ = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}

function getAtomFromArgs(args) {
  switch (args.length) {
    case 0:
      return globalState.trackingDerivation;

    case 1:
      return getAtom(args[0]);

    case 2:
      return getAtom(args[0], args[1]);
  }
}

/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */

function transaction(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }

  startBatch();

  try {
    return action.apply(thisArg);
  } finally {
    endBatch();
  }
}

function getAdm(target) {
  return target[$mobx];
} // Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
// and skip either the internal values map, or the base object with its property descriptors!


var objectProxyTraps = {
  has: function has(target, name) {

    return getAdm(target).has_(name);
  },
  get: function get(target, name) {
    return getAdm(target).get_(name);
  },
  set: function set(target, name, value) {
    var _getAdm$set_;

    if (!isStringish(name)) {
      return false;
    }


    return (_getAdm$set_ = getAdm(target).set_(name, value, true)) != null ? _getAdm$set_ : true;
  },
  deleteProperty: function deleteProperty(target, name) {
    var _getAdm$delete_;

    if (!isStringish(name)) {
      return false;
    } // null (intercepted) -> true (success)


    return (_getAdm$delete_ = getAdm(target).delete_(name, true)) != null ? _getAdm$delete_ : true;
  },
  defineProperty: function defineProperty(target, name, descriptor) {
    var _getAdm$definePropert;


    return (_getAdm$definePropert = getAdm(target).defineProperty_(name, descriptor)) != null ? _getAdm$definePropert : true;
  },
  ownKeys: function ownKeys(target) {

    return getAdm(target).ownKeys_();
  },
  preventExtensions: function preventExtensions(target) {
    die(13);
  }
};
function asDynamicObservableObject(target, options) {
  var _target$$mobx, _target$$mobx$proxy_;

  assertProxies();
  target = asObservableObject(target, options);
  return (_target$$mobx$proxy_ = (_target$$mobx = target[$mobx]).proxy_) != null ? _target$$mobx$proxy_ : _target$$mobx.proxy_ = new Proxy(target, objectProxyTraps);
}

function hasInterceptors(interceptable) {
  return interceptable.interceptors_ !== undefined && interceptable.interceptors_.length > 0;
}
function registerInterceptor(interceptable, handler) {
  var interceptors = interceptable.interceptors_ || (interceptable.interceptors_ = []);
  interceptors.push(handler);
  return once(function () {
    var idx = interceptors.indexOf(handler);

    if (idx !== -1) {
      interceptors.splice(idx, 1);
    }
  });
}
function interceptChange(interceptable, change) {
  var prevU = untrackedStart();

  try {
    // Interceptor can modify the array, copy it to avoid concurrent modification, see #1950
    var interceptors = [].concat(interceptable.interceptors_ || []);

    for (var i = 0, l = interceptors.length; i < l; i++) {
      change = interceptors[i](change);

      if (change && !change.type) {
        die(14);
      }

      if (!change) {
        break;
      }
    }

    return change;
  } finally {
    untrackedEnd(prevU);
  }
}

function hasListeners(listenable) {
  return listenable.changeListeners_ !== undefined && listenable.changeListeners_.length > 0;
}
function registerListener(listenable, handler) {
  var listeners = listenable.changeListeners_ || (listenable.changeListeners_ = []);
  listeners.push(handler);
  return once(function () {
    var idx = listeners.indexOf(handler);

    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  });
}
function notifyListeners(listenable, change) {
  var prevU = untrackedStart();
  var listeners = listenable.changeListeners_;

  if (!listeners) {
    return;
  }

  listeners = listeners.slice();

  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](change);
  }

  untrackedEnd(prevU);
}

function makeObservable(target, annotations, options) {
  var adm = asObservableObject(target, options)[$mobx];
  startBatch();

  try {
    var _annotations;

    if ("production" !== "production" && annotations && target[storedAnnotationsSymbol]) ; // Default to decorators


    (_annotations = annotations) != null ? _annotations : annotations = collectStoredAnnotations(target); // Annotate

    ownKeys(annotations).forEach(function (key) {
      return adm.make_(key, annotations[key]);
    });
  } finally {
    endBatch();
  }

  return target;
} // proto[keysSymbol] = new Set<PropertyKey>()

var SPLICE = "splice";
var UPDATE = "update";
var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859

var arrayTraps = {
  get: function get(target, name) {
    var adm = target[$mobx];

    if (name === $mobx) {
      return adm;
    }

    if (name === "length") {
      return adm.getArrayLength_();
    }

    if (typeof name === "string" && !isNaN(name)) {
      return adm.get_(parseInt(name));
    }

    if (hasProp(arrayExtensions, name)) {
      return arrayExtensions[name];
    }

    return target[name];
  },
  set: function set(target, name, value) {
    var adm = target[$mobx];

    if (name === "length") {
      adm.setArrayLength_(value);
    }

    if (typeof name === "symbol" || isNaN(name)) {
      target[name] = value;
    } else {
      // numeric string
      adm.set_(parseInt(name), value);
    }

    return true;
  },
  preventExtensions: function preventExtensions() {
    die(15);
  }
};
var ObservableArrayAdministration = /*#__PURE__*/function () {
  // this is the prop that gets proxied, so can't replace it!
  function ObservableArrayAdministration(name, enhancer, owned_, legacyMode_) {
    if (name === void 0) {
      name = "ObservableArray";
    }

    this.owned_ = void 0;
    this.legacyMode_ = void 0;
    this.atom_ = void 0;
    this.values_ = [];
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.enhancer_ = void 0;
    this.dehancer = void 0;
    this.proxy_ = void 0;
    this.lastKnownLength_ = 0;
    this.owned_ = owned_;
    this.legacyMode_ = legacyMode_;
    this.atom_ = new Atom(name);

    this.enhancer_ = function (newV, oldV) {
      return enhancer(newV, oldV, "ObservableArray[..]");
    };
  }

  var _proto = ObservableArrayAdministration.prototype;

  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.dehanceValues_ = function dehanceValues_(values) {
    if (this.dehancer !== undefined && values.length > 0) {
      return values.map(this.dehancer);
    }

    return values;
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }

    if (fireImmediately) {
      listener({
        observableKind: "array",
        object: this.proxy_,
        debugObjectName: this.atom_.name_,
        type: "splice",
        index: 0,
        added: this.values_.slice(),
        addedCount: this.values_.length,
        removed: [],
        removedCount: 0
      });
    }

    return registerListener(this, listener);
  };

  _proto.getArrayLength_ = function getArrayLength_() {
    this.atom_.reportObserved();
    return this.values_.length;
  };

  _proto.setArrayLength_ = function setArrayLength_(newLength) {
    if (typeof newLength !== "number" || isNaN(newLength) || newLength < 0) {
      die("Out of range: " + newLength);
    }

    var currentLength = this.values_.length;

    if (newLength === currentLength) {
      return;
    } else if (newLength > currentLength) {
      var newItems = new Array(newLength - currentLength);

      for (var i = 0; i < newLength - currentLength; i++) {
        newItems[i] = undefined;
      } // No Array.fill everywhere...


      this.spliceWithArray_(currentLength, 0, newItems);
    } else {
      this.spliceWithArray_(newLength, currentLength - newLength);
    }
  };

  _proto.updateArrayLength_ = function updateArrayLength_(oldLength, delta) {
    if (oldLength !== this.lastKnownLength_) {
      die(16);
    }

    this.lastKnownLength_ += delta;

    if (this.legacyMode_ && delta > 0) {
      reserveArrayBuffer(oldLength + delta + 1);
    }
  };

  _proto.spliceWithArray_ = function spliceWithArray_(index, deleteCount, newItems) {
    var _this = this;

    checkIfStateModificationsAreAllowed(this.atom_);
    var length = this.values_.length;

    if (index === undefined) {
      index = 0;
    } else if (index > length) {
      index = length;
    } else if (index < 0) {
      index = Math.max(0, length + index);
    }

    if (arguments.length === 1) {
      deleteCount = length - index;
    } else if (deleteCount === undefined || deleteCount === null) {
      deleteCount = 0;
    } else {
      deleteCount = Math.max(0, Math.min(deleteCount, length - index));
    }

    if (newItems === undefined) {
      newItems = EMPTY_ARRAY;
    }

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_,
        type: SPLICE,
        index: index,
        removedCount: deleteCount,
        added: newItems
      });

      if (!change) {
        return EMPTY_ARRAY;
      }

      deleteCount = change.removedCount;
      newItems = change.added;
    }

    newItems = newItems.length === 0 ? newItems : newItems.map(function (v) {
      return _this.enhancer_(v, undefined);
    });

    if (this.legacyMode_ || "production" !== "production") {
      var lengthDelta = newItems.length - deleteCount;
      this.updateArrayLength_(length, lengthDelta); // checks if internal array wasn't modified
    }

    var res = this.spliceItemsIntoValues_(index, deleteCount, newItems);

    if (deleteCount !== 0 || newItems.length !== 0) {
      this.notifyArraySplice_(index, newItems, res);
    }

    return this.dehanceValues_(res);
  };

  _proto.spliceItemsIntoValues_ = function spliceItemsIntoValues_(index, deleteCount, newItems) {
    if (newItems.length < MAX_SPLICE_SIZE) {
      var _this$values_;

      return (_this$values_ = this.values_).splice.apply(_this$values_, [index, deleteCount].concat(newItems));
    } else {
      // The items removed by the splice
      var res = this.values_.slice(index, index + deleteCount); // The items that that should remain at the end of the array

      var oldItems = this.values_.slice(index + deleteCount); // New length is the previous length + addition count - deletion count

      this.values_.length += newItems.length - deleteCount;

      for (var i = 0; i < newItems.length; i++) {
        this.values_[index + i] = newItems[i];
      }

      for (var _i = 0; _i < oldItems.length; _i++) {
        this.values_[index + newItems.length + _i] = oldItems[_i];
      }

      return res;
    }
  };

  _proto.notifyArrayChildUpdate_ = function notifyArrayChildUpdate_(index, newValue, oldValue) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      type: UPDATE,
      debugObjectName: this.atom_.name_,
      index: index,
      newValue: newValue,
      oldValue: oldValue
    } : null; // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't

    this.atom_.reportChanged();

    if (notify) {
      notifyListeners(this, change);
    }
  };

  _proto.notifyArraySplice_ = function notifyArraySplice_(index, added, removed) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: SPLICE,
      index: index,
      removed: removed,
      added: added,
      removedCount: removed.length,
      addedCount: added.length
    } : null;

    this.atom_.reportChanged(); // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe

    if (notify) {
      notifyListeners(this, change);
    }
  };

  _proto.get_ = function get_(index) {
    if (index < this.values_.length) {
      this.atom_.reportObserved();
      return this.dehanceValue_(this.values_[index]);
    }

    console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
  };

  _proto.set_ = function set_(index, newValue) {
    var values = this.values_;

    if (index < values.length) {
      // update at index in range
      checkIfStateModificationsAreAllowed(this.atom_);
      var oldValue = values[index];

      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          type: UPDATE,
          object: this.proxy_,
          index: index,
          newValue: newValue
        });

        if (!change) {
          return;
        }

        newValue = change.newValue;
      }

      newValue = this.enhancer_(newValue, oldValue);
      var changed = newValue !== oldValue;

      if (changed) {
        values[index] = newValue;
        this.notifyArrayChildUpdate_(index, newValue, oldValue);
      }
    } else if (index === values.length) {
      // add a new item
      this.spliceWithArray_(index, 0, [newValue]);
    } else {
      // out of bounds
      die(17, index, values.length);
    }
  };

  return ObservableArrayAdministration;
}();
function createObservableArray(initialValues, enhancer, name, owned) {
  if (name === void 0) {
    name = "ObservableArray";
  }

  if (owned === void 0) {
    owned = false;
  }

  assertProxies();
  var adm = new ObservableArrayAdministration(name, enhancer, owned, false);
  addHiddenFinalProp(adm.values_, $mobx, adm);
  var proxy = new Proxy(adm.values_, arrayTraps);
  adm.proxy_ = proxy;

  if (initialValues && initialValues.length) {
    var prev = allowStateChangesStart(true);
    adm.spliceWithArray_(0, 0, initialValues);
    allowStateChangesEnd(prev);
  }

  return proxy;
} // eslint-disable-next-line

var arrayExtensions = {
  clear: function clear() {
    return this.splice(0);
  },
  replace: function replace(newItems) {
    var adm = this[$mobx];
    return adm.spliceWithArray_(0, adm.values_.length, newItems);
  },
  // Used by JSON.stringify
  toJSON: function toJSON() {
    return this.slice();
  },

  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function splice(index, deleteCount) {
    for (var _len = arguments.length, newItems = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      newItems[_key - 2] = arguments[_key];
    }

    var adm = this[$mobx];

    switch (arguments.length) {
      case 0:
        return [];

      case 1:
        return adm.spliceWithArray_(index);

      case 2:
        return adm.spliceWithArray_(index, deleteCount);
    }

    return adm.spliceWithArray_(index, deleteCount, newItems);
  },
  spliceWithArray: function spliceWithArray(index, deleteCount, newItems) {
    return this[$mobx].spliceWithArray_(index, deleteCount, newItems);
  },
  push: function push() {
    var adm = this[$mobx];

    for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }

    adm.spliceWithArray_(adm.values_.length, 0, items);
    return adm.values_.length;
  },
  pop: function pop() {
    return this.splice(Math.max(this[$mobx].values_.length - 1, 0), 1)[0];
  },
  shift: function shift() {
    return this.splice(0, 1)[0];
  },
  unshift: function unshift() {
    var adm = this[$mobx];

    for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      items[_key3] = arguments[_key3];
    }

    adm.spliceWithArray_(0, 0, items);
    return adm.values_.length;
  },
  reverse: function reverse() {
    // reverse by default mutates in place before returning the result
    // which makes it both a 'derivation' and a 'mutation'.
    if (globalState.trackingDerivation) {
      die(37, "reverse");
    }

    this.replace(this.slice().reverse());
    return this;
  },
  sort: function sort() {
    // sort by default mutates in place before returning the result
    // which goes against all good practices. Let's not change the array in place!
    if (globalState.trackingDerivation) {
      die(37, "sort");
    }

    var copy = this.slice();
    copy.sort.apply(copy, arguments);
    this.replace(copy);
    return this;
  },
  remove: function remove(value) {
    var adm = this[$mobx];
    var idx = adm.dehanceValues_(adm.values_).indexOf(value);

    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }

    return false;
  }
};
/**
 * Wrap function from prototype
 * Without this, everything works as well, but this works
 * faster as everything works on unproxied values
 */

addArrayExtension("concat", simpleFunc);
addArrayExtension("flat", simpleFunc);
addArrayExtension("includes", simpleFunc);
addArrayExtension("indexOf", simpleFunc);
addArrayExtension("join", simpleFunc);
addArrayExtension("lastIndexOf", simpleFunc);
addArrayExtension("slice", simpleFunc);
addArrayExtension("toString", simpleFunc);
addArrayExtension("toLocaleString", simpleFunc); // map

addArrayExtension("every", mapLikeFunc);
addArrayExtension("filter", mapLikeFunc);
addArrayExtension("find", mapLikeFunc);
addArrayExtension("findIndex", mapLikeFunc);
addArrayExtension("flatMap", mapLikeFunc);
addArrayExtension("forEach", mapLikeFunc);
addArrayExtension("map", mapLikeFunc);
addArrayExtension("some", mapLikeFunc); // reduce

addArrayExtension("reduce", reduceLikeFunc);
addArrayExtension("reduceRight", reduceLikeFunc);

function addArrayExtension(funcName, funcFactory) {
  if (typeof Array.prototype[funcName] === "function") {
    arrayExtensions[funcName] = funcFactory(funcName);
  }
} // Report and delegate to dehanced array


function simpleFunc(funcName) {
  return function () {
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
} // Make sure callbacks recieve correct array arg #2326


function mapLikeFunc(funcName) {
  return function (callback, thisArg) {
    var _this2 = this;

    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName](function (element, index) {
      return callback.call(thisArg, element, index, _this2);
    });
  };
} // Make sure callbacks recieve correct array arg #2326


function reduceLikeFunc(funcName) {
  return function () {
    var _this3 = this;

    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_); // #2432 - reduce behavior depends on arguments.length

    var callback = arguments[0];

    arguments[0] = function (accumulator, currentValue, index) {
      return callback(accumulator, currentValue, index, _this3);
    };

    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
}

var isObservableArrayAdministration = /*#__PURE__*/createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
function isObservableArray(thing) {
  return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
}

var _Symbol$iterator, _Symbol$toStringTag;
var ObservableMapMarker = {};
var ADD = "add";
var DELETE = "delete"; // just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
// But: https://github.com/mobxjs/mobx/issues/1556

_Symbol$iterator = Symbol.iterator;
_Symbol$toStringTag = Symbol.toStringTag;
var ObservableMap = /*#__PURE__*/function () {
  // hasMap, not hashMap >-).
  function ObservableMap(initialData, enhancer_, name_) {
    var _this = this;

    if (enhancer_ === void 0) {
      enhancer_ = deepEnhancer;
    }

    if (name_ === void 0) {
      name_ = "ObservableMap";
    }

    this.enhancer_ = void 0;
    this.name_ = void 0;
    this[$mobx] = ObservableMapMarker;
    this.data_ = void 0;
    this.hasMap_ = void 0;
    this.keysAtom_ = void 0;
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = enhancer_;
    this.name_ = name_;

    if (!isFunction(Map)) {
      die(18);
    }

    this.keysAtom_ = createAtom("ObservableMap.keys()");
    this.data_ = new Map();
    this.hasMap_ = new Map();
    allowStateChanges(true, function () {
      _this.merge(initialData);
    });
  }

  var _proto = ObservableMap.prototype;

  _proto.has_ = function has_(key) {
    return this.data_.has(key);
  };

  _proto.has = function has(key) {
    var _this2 = this;

    if (!globalState.trackingDerivation) {
      return this.has_(key);
    }

    var entry = this.hasMap_.get(key);

    if (!entry) {
      var newEntry = entry = new ObservableValue(this.has_(key), referenceEnhancer, "ObservableMap.key?", false);
      this.hasMap_.set(key, newEntry);
      onBecomeUnobserved(newEntry, function () {
        return _this2.hasMap_["delete"](key);
      });
    }

    return entry.get();
  };

  _proto.set = function set(key, value) {
    var hasKey = this.has_(key);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: hasKey ? UPDATE : ADD,
        object: this,
        newValue: value,
        name: key
      });

      if (!change) {
        return this;
      }

      value = change.newValue;
    }

    if (hasKey) {
      this.updateValue_(key, value);
    } else {
      this.addValue_(key, value);
    }

    return this;
  };

  _proto["delete"] = function _delete(key) {
    var _this3 = this;

    checkIfStateModificationsAreAllowed(this.keysAtom_);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        name: key
      });

      if (!change) {
        return false;
      }
    }

    if (this.has_(key)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);

      var _change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: this.data_.get(key).value_,
        name: key
      } : null;


      transaction(function () {
        var _this3$hasMap_$get;

        _this3.keysAtom_.reportChanged();

        (_this3$hasMap_$get = _this3.hasMap_.get(key)) == null ? void 0 : _this3$hasMap_$get.setNewValue_(false);

        var observable = _this3.data_.get(key);

        observable.setNewValue_(undefined);

        _this3.data_["delete"](key);
      });

      if (notify) {
        notifyListeners(this, _change);
      }

      return true;
    }

    return false;
  };

  _proto.updateValue_ = function updateValue_(key, newValue) {
    var observable = this.data_.get(key);
    newValue = observable.prepareNewValue_(newValue);

    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: UPDATE,
        object: this,
        oldValue: observable.value_,
        name: key,
        newValue: newValue
      } : null;


      observable.setNewValue_(newValue);

      if (notify) {
        notifyListeners(this, change);
      }
    }
  };

  _proto.addValue_ = function addValue_(key, newValue) {
    var _this4 = this;

    checkIfStateModificationsAreAllowed(this.keysAtom_);
    transaction(function () {
      var _this4$hasMap_$get;

      var observable = new ObservableValue(newValue, _this4.enhancer_, "ObservableMap.key", false);

      _this4.data_.set(key, observable);

      newValue = observable.value_; // value might have been changed

      (_this4$hasMap_$get = _this4.hasMap_.get(key)) == null ? void 0 : _this4$hasMap_$get.setNewValue_(true);

      _this4.keysAtom_.reportChanged();
    });
    var notifySpy = isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ADD,
      object: this,
      name: key,
      newValue: newValue
    } : null;


    if (notify) {
      notifyListeners(this, change);
    }
  };

  _proto.get = function get(key) {
    if (this.has(key)) {
      return this.dehanceValue_(this.data_.get(key).get());
    }

    return this.dehanceValue_(undefined);
  };

  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.keys = function keys() {
    this.keysAtom_.reportObserved();
    return this.data_.keys();
  };

  _proto.values = function values() {
    var self = this;
    var keys = this.keys();
    return makeIterable({
      next: function next() {
        var _keys$next = keys.next(),
            done = _keys$next.done,
            value = _keys$next.value;

        return {
          done: done,
          value: done ? undefined : self.get(value)
        };
      }
    });
  };

  _proto.entries = function entries() {
    var self = this;
    var keys = this.keys();
    return makeIterable({
      next: function next() {
        var _keys$next2 = keys.next(),
            done = _keys$next2.done,
            value = _keys$next2.value;

        return {
          done: done,
          value: done ? undefined : [value, self.get(value)]
        };
      }
    });
  };

  _proto[_Symbol$iterator] = function () {
    return this.entries();
  };

  _proto.forEach = function forEach(callback, thisArg) {
    for (var _iterator = _createForOfIteratorHelperLoose(this), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          key = _step$value[0],
          value = _step$value[1];
      callback.call(thisArg, value, key, this);
    }
  }
  /** Merge another object into this object, returns this. */
  ;

  _proto.merge = function merge(other) {
    var _this5 = this;

    if (isObservableMap(other)) {
      other = new Map(other);
    }

    transaction(function () {
      if (isPlainObject(other)) {
        getPlainObjectKeys(other).forEach(function (key) {
          return _this5.set(key, other[key]);
        });
      } else if (Array.isArray(other)) {
        other.forEach(function (_ref) {
          var key = _ref[0],
              value = _ref[1];
          return _this5.set(key, value);
        });
      } else if (isES6Map(other)) {
        if (other.constructor !== Map) {
          die(19, other);
        }

        other.forEach(function (value, key) {
          return _this5.set(key, value);
        });
      } else if (other !== null && other !== undefined) {
        die(20, other);
      }
    });
    return this;
  };

  _proto.clear = function clear() {
    var _this6 = this;

    transaction(function () {
      untracked(function () {
        for (var _iterator2 = _createForOfIteratorHelperLoose(_this6.keys()), _step2; !(_step2 = _iterator2()).done;) {
          var key = _step2.value;

          _this6["delete"](key);
        }
      });
    });
  };

  _proto.replace = function replace(values) {
    var _this7 = this;

    // Implementation requirements:
    // - respect ordering of replacement map
    // - allow interceptors to run and potentially prevent individual operations
    // - don't recreate observables that already exist in original map (so we don't destroy existing subscriptions)
    // - don't _keysAtom.reportChanged if the keys of resulting map are indentical (order matters!)
    // - note that result map may differ from replacement map due to the interceptors
    transaction(function () {
      // Convert to map so we can do quick key lookups
      var replacementMap = convertToMap(values);
      var orderedData = new Map(); // Used for optimization

      var keysReportChangedCalled = false; // Delete keys that don't exist in replacement map
      // if the key deletion is prevented by interceptor
      // add entry at the beginning of the result map

      for (var _iterator3 = _createForOfIteratorHelperLoose(_this7.data_.keys()), _step3; !(_step3 = _iterator3()).done;) {
        var key = _step3.value;

        // Concurrently iterating/deleting keys
        // iterator should handle this correctly
        if (!replacementMap.has(key)) {
          var deleted = _this7["delete"](key); // Was the key removed?


          if (deleted) {
            // _keysAtom.reportChanged() was already called
            keysReportChangedCalled = true;
          } else {
            // Delete prevented by interceptor
            var value = _this7.data_.get(key);

            orderedData.set(key, value);
          }
        }
      } // Merge entries


      for (var _iterator4 = _createForOfIteratorHelperLoose(replacementMap.entries()), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
            _key = _step4$value[0],
            _value = _step4$value[1];

        // We will want to know whether a new key is added
        var keyExisted = _this7.data_.has(_key); // Add or update value


        _this7.set(_key, _value); // The addition could have been prevent by interceptor


        if (_this7.data_.has(_key)) {
          // The update could have been prevented by interceptor
          // and also we want to preserve existing values
          // so use value from _data map (instead of replacement map)
          var _value2 = _this7.data_.get(_key);

          orderedData.set(_key, _value2); // Was a new key added?

          if (!keyExisted) {
            // _keysAtom.reportChanged() was already called
            keysReportChangedCalled = true;
          }
        }
      } // Check for possible key order change


      if (!keysReportChangedCalled) {
        if (_this7.data_.size !== orderedData.size) {
          // If size differs, keys are definitely modified
          _this7.keysAtom_.reportChanged();
        } else {
          var iter1 = _this7.data_.keys();

          var iter2 = orderedData.keys();
          var next1 = iter1.next();
          var next2 = iter2.next();

          while (!next1.done) {
            if (next1.value !== next2.value) {
              _this7.keysAtom_.reportChanged();

              break;
            }

            next1 = iter1.next();
            next2 = iter2.next();
          }
        }
      } // Use correctly ordered map


      _this7.data_ = orderedData;
    });
    return this;
  };

  _proto.toString = function toString() {
    return "[object ObservableMap]";
  };

  _proto.toJSON = function toJSON() {
    return Array.from(this);
  };

  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */
  _proto.observe_ = function observe_(listener, fireImmediately) {

    return registerListener(this, listener);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _createClass(ObservableMap, [{
    key: "size",
    get: function get() {
      this.keysAtom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return "Map";
    }
  }]);

  return ObservableMap;
}(); // eslint-disable-next-line

var isObservableMap = /*#__PURE__*/createInstanceofPredicate("ObservableMap", ObservableMap);

function convertToMap(dataStructure) {
  if (isES6Map(dataStructure) || isObservableMap(dataStructure)) {
    return dataStructure;
  } else if (Array.isArray(dataStructure)) {
    return new Map(dataStructure);
  } else if (isPlainObject(dataStructure)) {
    var map = new Map();

    for (var key in dataStructure) {
      map.set(key, dataStructure[key]);
    }

    return map;
  } else {
    return die(21, dataStructure);
  }
}

var _Symbol$iterator$1, _Symbol$toStringTag$1;
var ObservableSetMarker = {};
_Symbol$iterator$1 = Symbol.iterator;
_Symbol$toStringTag$1 = Symbol.toStringTag;
var ObservableSet = /*#__PURE__*/function () {
  function ObservableSet(initialData, enhancer, name_) {
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }

    if (name_ === void 0) {
      name_ = "ObservableSet";
    }

    this.name_ = void 0;
    this[$mobx] = ObservableSetMarker;
    this.data_ = new Set();
    this.atom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = void 0;
    this.name_ = name_;

    if (!isFunction(Set)) {
      die(22);
    }

    this.atom_ = createAtom(this.name_);

    this.enhancer_ = function (newV, oldV) {
      return enhancer(newV, oldV, name_);
    };

    if (initialData) {
      this.replace(initialData);
    }
  }

  var _proto = ObservableSet.prototype;

  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.clear = function clear() {
    var _this = this;

    transaction(function () {
      untracked(function () {
        for (var _iterator = _createForOfIteratorHelperLoose(_this.data_.values()), _step; !(_step = _iterator()).done;) {
          var value = _step.value;

          _this["delete"](value);
        }
      });
    });
  };

  _proto.forEach = function forEach(callbackFn, thisArg) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this), _step2; !(_step2 = _iterator2()).done;) {
      var value = _step2.value;
      callbackFn.call(thisArg, value, value, this);
    }
  };

  _proto.add = function add(value) {
    var _this2 = this;

    checkIfStateModificationsAreAllowed(this.atom_);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: ADD,
        object: this,
        newValue: value
      });

      if (!change) {
        return this;
      } // ideally, value = change.value would be done here, so that values can be
      // changed by interceptor. Same applies for other Set and Map api's.

    }

    if (!this.has(value)) {
      transaction(function () {
        _this2.data_.add(_this2.enhancer_(value, undefined));

        _this2.atom_.reportChanged();
      });
      var notifySpy = "production" !== "production" ;
      var notify = hasListeners(this);

      var _change = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ADD,
        object: this,
        newValue: value
      } : null;

      if (notify) {
        notifyListeners(this, _change);
      }
    }

    return this;
  };

  _proto["delete"] = function _delete(value) {
    var _this3 = this;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        oldValue: value
      });

      if (!change) {
        return false;
      }
    }

    if (this.has(value)) {
      var notifySpy = "production" !== "production" ;
      var notify = hasListeners(this);

      var _change2 = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: value
      } : null;

      transaction(function () {
        _this3.atom_.reportChanged();

        _this3.data_["delete"](value);
      });

      if (notify) {
        notifyListeners(this, _change2);
      }

      return true;
    }

    return false;
  };

  _proto.has = function has(value) {
    this.atom_.reportObserved();
    return this.data_.has(this.dehanceValue_(value));
  };

  _proto.entries = function entries() {
    var nextIndex = 0;
    var keys = Array.from(this.keys());
    var values = Array.from(this.values());
    return makeIterable({
      next: function next() {
        var index = nextIndex;
        nextIndex += 1;
        return index < values.length ? {
          value: [keys[index], values[index]],
          done: false
        } : {
          done: true
        };
      }
    });
  };

  _proto.keys = function keys() {
    return this.values();
  };

  _proto.values = function values() {
    this.atom_.reportObserved();
    var self = this;
    var nextIndex = 0;
    var observableValues = Array.from(this.data_.values());
    return makeIterable({
      next: function next() {
        return nextIndex < observableValues.length ? {
          value: self.dehanceValue_(observableValues[nextIndex++]),
          done: false
        } : {
          done: true
        };
      }
    });
  };

  _proto.replace = function replace(other) {
    var _this4 = this;

    if (isObservableSet(other)) {
      other = new Set(other);
    }

    transaction(function () {
      if (Array.isArray(other)) {
        _this4.clear();

        other.forEach(function (value) {
          return _this4.add(value);
        });
      } else if (isES6Set(other)) {
        _this4.clear();

        other.forEach(function (value) {
          return _this4.add(value);
        });
      } else if (other !== null && other !== undefined) {
        die("Cannot initialize set from " + other);
      }
    });
    return this;
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {

    return registerListener(this, listener);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.toJSON = function toJSON() {
    return Array.from(this);
  };

  _proto.toString = function toString() {
    return "[object ObservableSet]";
  };

  _proto[_Symbol$iterator$1] = function () {
    return this.values();
  };

  _createClass(ObservableSet, [{
    key: "size",
    get: function get() {
      this.atom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: _Symbol$toStringTag$1,
    get: function get() {
      return "Set";
    }
  }]);

  return ObservableSet;
}(); // eslint-disable-next-line

var isObservableSet = /*#__PURE__*/createInstanceofPredicate("ObservableSet", ObservableSet);

var descriptorCache = /*#__PURE__*/Object.create(null);
var REMOVE = "remove";
var ObservableObjectAdministration = /*#__PURE__*/function () {
  function ObservableObjectAdministration(target_, values_, name_, // Used anytime annotation is not explicitely provided
  defaultAnnotation_) {
    if (values_ === void 0) {
      values_ = new Map();
    }

    if (defaultAnnotation_ === void 0) {
      defaultAnnotation_ = autoAnnotation;
    }

    this.target_ = void 0;
    this.values_ = void 0;
    this.name_ = void 0;
    this.defaultAnnotation_ = void 0;
    this.keysAtom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.proxy_ = void 0;
    this.isPlainObject_ = void 0;
    this.appliedAnnotations_ = void 0;
    this.pendingKeys_ = void 0;
    this.target_ = target_;
    this.values_ = values_;
    this.name_ = name_;
    this.defaultAnnotation_ = defaultAnnotation_;
    this.keysAtom_ = new Atom("ObservableObject.keys"); // Optimization: we use this frequently

    this.isPlainObject_ = isPlainObject(this.target_);
  }

  var _proto = ObservableObjectAdministration.prototype;

  _proto.getObservablePropValue_ = function getObservablePropValue_(key) {
    return this.values_.get(key).get();
  };

  _proto.setObservablePropValue_ = function setObservablePropValue_(key, newValue) {
    var observable = this.values_.get(key);

    if (observable instanceof ComputedValue) {
      observable.set(newValue);
      return true;
    } // intercept


    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: UPDATE,
        object: this.proxy_ || this.target_,
        name: key,
        newValue: newValue
      });

      if (!change) {
        return null;
      }

      newValue = change.newValue;
    }

    newValue = observable.prepareNewValue_(newValue); // notify spy & observers

    if (newValue !== globalState.UNCHANGED) {
      var notify = hasListeners(this);
      var notifySpy = "production" !== "production" ;

      var _change = notify || notifySpy ? {
        type: UPDATE,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: observable.value_,
        name: key,
        newValue: newValue
      } : null;
      observable.setNewValue_(newValue);

      if (notify) {
        notifyListeners(this, _change);
      }
    }

    return true;
  };

  _proto.get_ = function get_(key) {
    if (globalState.trackingDerivation && !hasProp(this.target_, key)) {
      // Key doesn't exist yet, subscribe for it in case it's added later
      this.has_(key);
    }

    return this.target_[key];
  }
  /**
   * @param {PropertyKey} key
   * @param {any} value
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.set_ = function set_(key, value, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    // Don't use .has(key) - we care about own
    if (hasProp(this.target_, key)) {
      // Existing prop
      if (this.values_.has(key)) {
        // Observable (can be intercepted)
        return this.setObservablePropValue_(key, value);
      } else if (proxyTrap) {
        // Non-observable - proxy
        return Reflect.set(this.target_, key, value);
      } else {
        // Non-observable
        this.target_[key] = value;
        return true;
      }
    } else {
      // New prop
      return this.extend_(key, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true
      }, this.defaultAnnotation_, proxyTrap);
    }
  } // Trap for "in"
  ;

  _proto.has_ = function has_(key) {
    if (!globalState.trackingDerivation) {
      // Skip key subscription outside derivation
      return key in this.target_;
    }

    this.pendingKeys_ || (this.pendingKeys_ = new Map());
    var entry = this.pendingKeys_.get(key);

    if (!entry) {
      entry = new ObservableValue(key in this.target_, referenceEnhancer, "ObservableObject.key?", false);
      this.pendingKeys_.set(key, entry);
    }

    return entry.get();
  }
  /**
   * @param {PropertyKey} key
   * @param {Annotation|boolean} annotation true - use default annotation, false - ignore prop
   */
  ;

  _proto.make_ = function make_(key, annotation) {
    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }

    if (annotation === false) {
      return;
    }

    if (!(key in this.target_)) {
      var _this$target_$storedA;

      // Throw on missing key, except for decorators:
      // Decorator annotations are collected from whole prototype chain.
      // When called from super() some props may not exist yet.
      // However we don't have to worry about missing prop,
      // because the decorator must have been applied to something.
      if ((_this$target_$storedA = this.target_[storedAnnotationsSymbol]) != null && _this$target_$storedA[key]) {
        return; // will be annotated by subclass constructor
      } else {
        die(1, annotation.annotationType_, this.name_ + "." + key.toString());
      }
    }

    var source = this.target_;

    while (source && source !== objectPrototype$1) {
      var descriptor = getDescriptor(source, key);

      if (descriptor) {
        var outcome = annotation.make_(this, key, descriptor, source);

        if (outcome === 0
        /* Cancel */
        ) {
          return;
        }

        if (outcome === 1
        /* Break */
        ) {
          break;
        }
      }

      source = Object.getPrototypeOf(source);
    }

    recordAnnotationApplied(this, annotation, key);
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.extend_ = function extend_(key, descriptor, annotation, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }

    if (annotation === false) {
      return this.defineProperty_(key, descriptor, proxyTrap);
    }
    var outcome = annotation.extend_(this, key, descriptor, proxyTrap);

    if (outcome) {
      recordAnnotationApplied(this, annotation, key);
    }

    return outcome;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.defineProperty_ = function defineProperty_(key, descriptor, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    try {
      startBatch(); // Delete

      var deleteOutcome = this.delete_(key);

      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      } // ADD interceptor


      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: descriptor.value
        });

        if (!change) {
          return null;
        }

        var newValue = change.newValue;

        if (descriptor.value !== newValue) {
          descriptor = _extends({}, descriptor, {
            value: newValue
          });
        }
      } // Define


      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty$1(this.target_, key, descriptor);
      } // Notify


      this.notifyPropertyAddition_(key, descriptor.value);
    } finally {
      endBatch();
    }

    return true;
  } // If original descriptor becomes relevant, move this to annotation directly
  ;

  _proto.defineObservableProperty_ = function defineObservableProperty_(key, value, enhancer, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    try {
      startBatch(); // Delete

      var deleteOutcome = this.delete_(key);

      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      } // ADD interceptor


      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: value
        });

        if (!change) {
          return null;
        }

        value = change.newValue;
      }

      var cachedDescriptor = getCachedObservablePropDescriptor(key);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: true,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      }; // Define

      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty$1(this.target_, key, descriptor);
      }

      var observable = new ObservableValue(value, enhancer, "production" !== "production" ? this.name_ + "." + key.toString() : "ObservableObject.key", false);
      this.values_.set(key, observable); // Notify (value possibly changed by ObservableValue)

      this.notifyPropertyAddition_(key, observable.value_);
    } finally {
      endBatch();
    }

    return true;
  } // If original descriptor becomes relevant, move this to annotation directly
  ;

  _proto.defineComputedProperty_ = function defineComputedProperty_(key, options, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    try {
      startBatch(); // Delete

      var deleteOutcome = this.delete_(key);

      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      } // ADD interceptor


      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: undefined
        });

        if (!change) {
          return null;
        }
      }

      options.name || (options.name = "production" !== "production" ? this.name_ + "." + key.toString() : "ObservableObject.key");
      options.context = this.proxy_ || this.target_;
      var cachedDescriptor = getCachedObservablePropDescriptor(key);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: false,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      }; // Define

      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty$1(this.target_, key, descriptor);
      }

      this.values_.set(key, new ComputedValue(options)); // Notify

      this.notifyPropertyAddition_(key, undefined);
    } finally {
      endBatch();
    }

    return true;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.delete_ = function delete_(key, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    // No such prop
    if (!hasProp(this.target_, key)) {
      return true;
    } // Intercept


    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_ || this.target_,
        name: key,
        type: REMOVE
      }); // Cancelled

      if (!change) {
        return null;
      }
    } // Delete


    try {
      var _this$pendingKeys_, _this$pendingKeys_$ge;

      startBatch();
      var notify = hasListeners(this);
      var notifySpy = "production" !== "production" && isSpyEnabled();
      var observable = this.values_.get(key); // Value needed for spies/listeners

      var value = undefined; // Optimization: don't pull the value unless we will need it

      if (!observable && (notify || notifySpy)) {
        var _getDescriptor;

        value = (_getDescriptor = getDescriptor(this.target_, key)) == null ? void 0 : _getDescriptor.value;
      } // delete prop (do first, may fail)


      if (proxyTrap) {
        if (!Reflect.deleteProperty(this.target_, key)) {
          return false;
        }
      } else {
        delete this.target_[key];
      } // Allow re-annotating this field


      if ("production" !== "production") ; // Clear observable


      if (observable) {
        this.values_["delete"](key); // for computed, value is undefined

        if (observable instanceof ObservableValue) {
          value = observable.value_;
        } // Notify: autorun(() => obj[key]), see #1796


        propagateChanged(observable);
      } // Notify "keys/entries/values" observers


      this.keysAtom_.reportChanged(); // Notify "has" observers
      // "in" as it may still exist in proto

      (_this$pendingKeys_ = this.pendingKeys_) == null ? void 0 : (_this$pendingKeys_$ge = _this$pendingKeys_.get(key)) == null ? void 0 : _this$pendingKeys_$ge.set(key in this.target_); // Notify spies/listeners

      if (notify || notifySpy) {
        var _change2 = {
          type: REMOVE,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: value,
          name: key
        };

        if ("production" !== "production" && notifySpy) ;

        if (notify) {
          notifyListeners(this, _change2);
        }

        if ("production" !== "production" && notifySpy) ;
      }
    } finally {
      endBatch();
    }

    return true;
  }
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */
  ;

  _proto.observe_ = function observe_(callback, fireImmediately) {

    return registerListener(this, callback);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.notifyPropertyAddition_ = function notifyPropertyAddition_(key, value) {
    var _this$pendingKeys_2, _this$pendingKeys_2$g;

    var notify = hasListeners(this);
    var notifySpy = "production" !== "production" ;

    if (notify || notifySpy) {
      var change = notify || notifySpy ? {
        type: ADD,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: key,
        newValue: value
      } : null;

      if (notify) {
        notifyListeners(this, change);
      }
    }

    (_this$pendingKeys_2 = this.pendingKeys_) == null ? void 0 : (_this$pendingKeys_2$g = _this$pendingKeys_2.get(key)) == null ? void 0 : _this$pendingKeys_2$g.set(true); // Notify "keys/entries/values" observers

    this.keysAtom_.reportChanged();
  };

  _proto.ownKeys_ = function ownKeys_() {
    this.keysAtom_.reportObserved();
    return ownKeys(this.target_);
  };

  _proto.keys_ = function keys_() {
    // Returns enumerable && own, but unfortunately keysAtom will report on ANY key change.
    // There is no way to distinguish between Object.keys(object) and Reflect.ownKeys(object) - both are handled by ownKeys trap.
    // We can either over-report in Object.keys(object) or under-report in Reflect.ownKeys(object)
    // We choose to over-report in Object.keys(object), because:
    // - typically it's used with simple data objects
    // - when symbolic/non-enumerable keys are relevant Reflect.ownKeys works as expected
    this.keysAtom_.reportObserved();
    return Object.keys(this.target_);
  };

  return ObservableObjectAdministration;
}();
function asObservableObject(target, options) {
  var _options$name;

  if (hasProp(target, $mobx)) {

    return target;
  }

  var name = (_options$name = options == null ? void 0 : options.name) != null ? _options$name : "ObservableObject";
  var adm = new ObservableObjectAdministration(target, new Map(), String(name), getAnnotationFromOptions(options));
  addHiddenProp(target, $mobx, adm);
  return target;
}
var isObservableObjectAdministration = /*#__PURE__*/createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);

function getCachedObservablePropDescriptor(key) {
  return descriptorCache[key] || (descriptorCache[key] = {
    get: function get() {
      return this[$mobx].getObservablePropValue_(key);
    },
    set: function set(value) {
      return this[$mobx].setObservablePropValue_(key, value);
    }
  });
}

function isObservableObject(thing) {
  if (isObject(thing)) {
    return isObservableObjectAdministration(thing[$mobx]);
  }

  return false;
}
function recordAnnotationApplied(adm, annotation, key) {
  var _adm$target_$storedAn;


  (_adm$target_$storedAn = adm.target_[storedAnnotationsSymbol]) == null ? true : delete _adm$target_$storedAn[key];
}

/**
 * This array buffer contains two lists of properties, so that all arrays
 * can recycle their property definitions, which significantly improves performance of creating
 * properties on the fly.
 */

var OBSERVABLE_ARRAY_BUFFER_SIZE = 0; // Typescript workaround to make sure ObservableArray extends Array

var StubArray = function StubArray() {};

function inherit(ctor, proto) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ctor.prototype, proto);
  } else if (ctor.prototype.__proto__ !== undefined) {
    ctor.prototype.__proto__ = proto;
  } else {
    ctor.prototype = proto;
  }
}

inherit(StubArray, Array.prototype); // Weex proto freeze protection was here,
// but it is unclear why the hack is need as MobX never changed the prototype
// anyway, so removed it in V6

var LegacyObservableArray = /*#__PURE__*/function (_StubArray, _Symbol$toStringTag, _Symbol$iterator) {
  _inheritsLoose(LegacyObservableArray, _StubArray);

  function LegacyObservableArray(initialValues, enhancer, name, owned) {
    var _this;

    if (name === void 0) {
      name = "ObservableArray";
    }

    if (owned === void 0) {
      owned = false;
    }

    _this = _StubArray.call(this) || this;
    var adm = new ObservableArrayAdministration(name, enhancer, owned, true);
    adm.proxy_ = _assertThisInitialized(_this);
    addHiddenFinalProp(_assertThisInitialized(_this), $mobx, adm);

    if (initialValues && initialValues.length) {
      var prev = allowStateChangesStart(true); // @ts-ignore

      _this.spliceWithArray(0, 0, initialValues);

      allowStateChangesEnd(prev);
    }

    return _this;
  }

  var _proto = LegacyObservableArray.prototype;

  _proto.concat = function concat() {
    this[$mobx].atom_.reportObserved();

    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return Array.prototype.concat.apply(this.slice(), //@ts-ignore
    arrays.map(function (a) {
      return isObservableArray(a) ? a.slice() : a;
    }));
  };

  _proto[_Symbol$iterator] = function () {
    var self = this;
    var nextIndex = 0;
    return makeIterable({
      next: function next() {
        return nextIndex < self.length ? {
          value: self[nextIndex++],
          done: false
        } : {
          done: true,
          value: undefined
        };
      }
    });
  };

  _createClass(LegacyObservableArray, [{
    key: "length",
    get: function get() {
      return this[$mobx].getArrayLength_();
    },
    set: function set(newLength) {
      this[$mobx].setArrayLength_(newLength);
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return "Array";
    }
  }]);

  return LegacyObservableArray;
}(StubArray, Symbol.toStringTag, Symbol.iterator);

Object.entries(arrayExtensions).forEach(function (_ref) {
  var prop = _ref[0],
      fn = _ref[1];

  if (prop !== "concat") {
    addHiddenProp(LegacyObservableArray.prototype, prop, fn);
  }
});

function createArrayEntryDescriptor(index) {
  return {
    enumerable: false,
    configurable: true,
    get: function get() {
      return this[$mobx].get_(index);
    },
    set: function set(value) {
      this[$mobx].set_(index, value);
    }
  };
}

function createArrayBufferItem(index) {
  defineProperty$1(LegacyObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
}

function reserveArrayBuffer(max) {
  if (max > OBSERVABLE_ARRAY_BUFFER_SIZE) {
    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max + 100; index++) {
      createArrayBufferItem(index);
    }

    OBSERVABLE_ARRAY_BUFFER_SIZE = max;
  }
}
reserveArrayBuffer(1000);
function createLegacyArray(initialValues, enhancer, name) {
  return new LegacyObservableArray(initialValues, enhancer, name);
}

function getAtom(thing, property) {
  if (typeof thing === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      if (property !== undefined) {
        die(23);
      }

      return thing[$mobx].atom_;
    }

    if (isObservableSet(thing)) {
      return thing[$mobx];
    }

    if (isObservableMap(thing)) {
      if (property === undefined) {
        return thing.keysAtom_;
      }

      var observable = thing.data_.get(property) || thing.hasMap_.get(property);

      if (!observable) {
        die(25, property, getDebugName(thing));
      }

      return observable;
    }


    if (isObservableObject(thing)) {
      if (!property) {
        return die(26);
      }

      var _observable = thing[$mobx].values_.get(property);

      if (!_observable) {
        die(27, property, getDebugName(thing));
      }

      return _observable;
    }

    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
      return thing;
    }
  } else if (isFunction(thing)) {
    if (isReaction(thing[$mobx])) {
      // disposer function
      return thing[$mobx];
    }
  }

  die(28);
}
function getAdministration(thing, property) {
  if (!thing) {
    die(29);
  }

  if (property !== undefined) {
    return getAdministration(getAtom(thing, property));
  }

  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
    return thing;
  }

  if (isObservableMap(thing) || isObservableSet(thing)) {
    return thing;
  }

  if (thing[$mobx]) {
    return thing[$mobx];
  }

  die(24, thing);
}
function getDebugName(thing, property) {
  var named;

  if (property !== undefined) {
    named = getAtom(thing, property);
  } else if (isAction(thing)) {
    return thing.name;
  } else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing)) {
    named = getAdministration(thing);
  } else {
    // valid for arrays as well
    named = getAtom(thing);
  }

  return named.name_;
}

var toString$1 = objectPrototype$1.toString;
function deepEqual(a, b, depth) {
  if (depth === void 0) {
    depth = -1;
  }

  return eq(a, b, depth);
} // Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.

function eq(a, b, depth, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } // `null` or `undefined` only equal to itself (strict comparison).


  if (a == null || b == null) {
    return false;
  } // `NaN`s are equivalent, but non-reflexive.


  if (a !== a) {
    return b !== b;
  } // Exhaust primitive checks


  var type = typeof a;

  if (type !== "function" && type !== "object" && typeof b != "object") {
    return false;
  } // Compare `[[Class]]` names.


  var className = toString$1.call(a);

  if (className !== toString$1.call(b)) {
    return false;
  }

  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]": // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

    case "[object String]":
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return "" + a === "" + b;

    case "[object Number]":
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) {
        return +b !== +b;
      } // An `egal` comparison is performed for other numeric values.


      return +a === 0 ? 1 / +a === 1 / b : +a === +b;

    case "[object Date]":
    case "[object Boolean]":
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;

    case "[object Symbol]":
      return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);

    case "[object Map]":
    case "[object Set]":
      // Maps and Sets are unwrapped to arrays of entry-pairs, adding an incidental level.
      // Hide this extra level by increasing the depth.
      if (depth >= 0) {
        depth++;
      }

      break;
  } // Unwrap any wrapped objects.


  a = unwrap(a);
  b = unwrap(b);
  var areArrays = className === "[object Array]";

  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") {
      return false;
    } // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.


    var aCtor = a.constructor,
        bCtor = b.constructor;

    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
      return false;
    }
  }

  if (depth === 0) {
    return false;
  } else if (depth < 0) {
    depth = -1;
  } // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.


  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;

  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  } // Add the first object to the stack of traversed objects.


  aStack.push(a);
  bStack.push(b); // Recursively compare objects and arrays.

  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;

    if (length !== b.length) {
      return false;
    } // Deep compare the contents, ignoring non-numeric properties.


    while (length--) {
      if (!eq(a[length], b[length], depth - 1, aStack, bStack)) {
        return false;
      }
    }
  } else {
    // Deep compare objects.
    var keys = Object.keys(a);
    var key;
    length = keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.

    if (Object.keys(b).length !== length) {
      return false;
    }

    while (length--) {
      // Deep compare each member
      key = keys[length];

      if (!(hasProp(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack))) {
        return false;
      }
    }
  } // Remove the first object from the stack of traversed objects.


  aStack.pop();
  bStack.pop();
  return true;
}

function unwrap(a) {
  if (isObservableArray(a)) {
    return a.slice();
  }

  if (isES6Map(a) || isObservableMap(a)) {
    return Array.from(a.entries());
  }

  if (isES6Set(a) || isObservableSet(a)) {
    return Array.from(a.entries());
  }

  return a;
}

function makeIterable(iterator) {
  iterator[Symbol.iterator] = getSelf;
  return iterator;
}

function getSelf() {
  return this;
}

/**
 * (c) Michel Weststrate 2015 - 2020
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get a global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */
["Symbol", "Map", "Set"].forEach(function (m) {
  var g = getGlobal();

  if (typeof g[m] === "undefined") {
    die("MobX requires global '" + m + "' to be available or polyfilled");
  }
});

if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
  // See: https://github.com/andykog/mobx-devtools/
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: {
      getDebugName: getDebugName
    },
    $mobx: $mobx
  });
}

// eslint-disable-next-line no-restricted-imports
const annotationsSymbol = Symbol('annotationsSymbol');
const objectPrototype = Object.prototype; // see details in https://github.com/mobxjs/mobx/discussions/2850

function makeSimpleAutoObservable(target) {
  // These could be params but we hard-code them
  const overrides = {};
  const options = {}; // Make sure nobody called makeObservable/etc. previously (eg in parent constructor)

  if (isObservable(target)) {
    throw new Error('Target must not be observable');
  }

  let annotations = target[annotationsSymbol];

  if (!annotations) {
    annotations = {};
    let current = target;

    while (current && current !== objectPrototype) {
      Reflect.ownKeys(current).forEach(key => {
        if (key === $mobx || key === 'constructor') return;
        annotations[key] = !overrides ? true : key in overrides ? overrides[key] : true;
      });
      current = Object.getPrototypeOf(current);
    } // Cache if class


    const proto = Object.getPrototypeOf(target);

    if (proto && proto !== objectPrototype) {
      Object.defineProperty(proto, annotationsSymbol, {
        value: annotations
      });
    }
  }

  return makeObservable(target, annotations, options);
}

function Store() {
  // eslint-disable-next-line no-unused-vars
  return function extend(Context) {
    const serviceFn = Service({
      id: Context
    });
    let SubClass = class SubClass extends Context {
      constructor(...args) {
        super(...args);
        makeSimpleAutoObservable(this);
      }

    };
    return serviceFn(SubClass);
  };
}

// eslint-disable-next-line no-restricted-imports

function bindContext(context, field) {
  if (field === 'constructor') return; // @ts-ignore

  if (typeof context[field] === 'function') {
    // @ts-ignore
    context[field] = context[field].bind(context);
  }
}

function autoBind(context) {
  for (const key in context) {
    bindContext(context, key);
  } // eslint-disable-next-line no-proto


  const proto = Object.getPrototypeOf(context.constructor.prototype);
  const names = Object.getOwnPropertyNames(proto);
  names.forEach(field => {
    bindContext(context, field);
  });
}

function Action() {
  return function extend(Context) {
    const serviceFn = Service({
      id: Context
    });
    let SubClass = class SubClass extends Context {
      constructor(...args) {
        super(...args);
        autoBind(this);
      }

    };
    return serviceFn(SubClass);
  };
}

// eslint-disable-next-line no-restricted-imports
function Module() {
  return function extend(Context) {
    const serviceFn = Service();
    return serviceFn(Context);
  };
}

var n$1,l$1,u$1,t$2,o$2,r$1,f$1,e$2={},c$1=[],s$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a$1(n,l){for(var u in l)n[u]=l[u];return n}function h$1(n){var l=n.parentNode;l&&l.removeChild(n);}function v$1(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n$1.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y$1(l,f,t,o,null)}function y$1(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u$1:r};return null==r&&null!=l$1.vnode&&l$1.vnode(f),f}function p$1(){return {current:null}}function d$1(n){return n.children}function _$1(n,l){this.props=n,this.context=l;}function k$2(n,l){if(null==l)return n.__?k$2(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?k$2(n):null}function b$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b$1(n)}}function m$1(n){(!n.__d&&(n.__d=!0)&&t$2.push(n)&&!g$2.__r++||r$1!==l$1.debounceRendering)&&((r$1=l$1.debounceRendering)||o$2)(g$2);}function g$2(){for(var n;g$2.__r=t$2.length;)n=t$2.sort(function(n,l){return n.__v.__b-l.__v.__b}),t$2=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a$1({},t)).__v=t.__v+1,j$2(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k$2(t):o,t.__h),z$2(u,t),t.__e!=o&&b$1(t)));});}function w$2(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c$1,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y$1(null,_,null,null,_):Array.isArray(_)?y$1(d$1,{children:_},null,null,null):_.__b>0?y$1(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null;}j$2(n,_,p=p||e$2,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&_.__k===p.__k?_.__d=s=x$2(_,s,n):s=P$1(n,_,p,w,b,s),"function"==typeof u.type&&(u.__d=s)):s&&p.__e==s&&s.parentNode!=n&&(s=k$2(p));}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k$2(i,h+1)),N$1(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M$1(g[h],g[++h],g[++h]);}function x$2(n,l,u){for(var i,t=n.__k,o=0;t&&o<t.length;o++)(i=t[o])&&(i.__=n,l="function"==typeof i.type?x$2(i,l,u):P$1(u,i,i,t,i.__e,l));return l}function A$2(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){A$2(n,l);}):l.push(n)),l}function P$1(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else {for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o;}return void 0!==r?r:t.nextSibling}function C$1(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H$1(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H$1(n,o,l[o],u[o],i);}function $$1(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s$1.test(l)?u:u+"px";}function H$1(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$$1(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$$1(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T$2:I$1,o):n.removeEventListener(l,o?T$2:I$1,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function I$1(n){this.l[n.type+!1](l$1.event?l$1.event(n):n);}function T$2(n){this.l[n.type+!0](l$1.event?l$1.event(n):n);}function j$2(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P,C,$=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l$1.__b)&&s(u);try{n:if("function"==typeof $){if(m=u.props,g=(s=$.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in $&&$.prototype.render?u.__c=h=new $(m,x):(u.__c=h=new _$1(m,x),h.constructor=$,h.render=O$1),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=$.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a$1({},h.__s)),a$1(h.__s,$.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==$.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==$.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k);});}if(h.context=x,h.props=m,h.__v=u,h.__P=n,A=l$1.__r,P=0,"prototype"in $&&$.prototype.render)h.state=h.__s,h.__d=!1,A&&A(u),s=h.render(h.props,h.state,h.context);else do{h.__d=!1,A&&A(u),s=h.render(h.props,h.state,h.context),h.state=h.__s;}while(h.__d&&++P<25);h.state=h.__s,null!=h.getChildContext&&(t=a$1(a$1({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),C=null!=s&&s.type===d$1&&null==s.key?s.props.children:s,w$2(n,Array.isArray(C)?C:[C],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L$1(i.__e,u,i,t,o,r,f,c);(s=l$1.diffed)&&s(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l$1.__e(n,u,i);}}function z$2(n,u){l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function L$1(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1;}if(null===d)y===p||c&&l.data===p||(l.data=p);else {if(r=r&&n$1.call(l.childNodes),a=(y=i.props||e$2).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""));}if(C$1(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w$2(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k$2(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h$1(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&H$1(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H$1(l,"checked",_,y.checked,!1));}return l}function M$1(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l$1.__e(n,i);}}function N$1(n,u,i){var t,o;if(l$1.unmount&&l$1.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M$1(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l$1.__e(n,u);}t.base=t.__P=null;}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N$1(t[o],u,"function"!=typeof n.type);i||null==n.__e||h$1(n.__e),n.__e=n.__d=void 0;}function O$1(n,l,u){return this.constructor(n,u)}function S$1(u,i,t){var o,r,f;l$1.__&&l$1.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j$2(i,u=(!o&&t||i).__k=v$1(d$1,null,[u]),r||e$2,e$2,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n$1.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z$2(f,u);}function q$2(n,l){S$1(n,l,q$2);}function B$1(l,u,i){var t,o,r,f=a$1({},l.props);for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n$1.call(arguments,2):i),y$1(l.type,f,t||l.key,o||l.ref,null)}function D$1(n,l){var u={__c:l="__cC"+f$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(m$1);},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n$1=c$1.slice,l$1={__e:function(n,l,u,i){for(var t,o,r;l=l.__;)if((t=l.__c)&&!t.__)try{if((o=t.constructor)&&null!=o.getDerivedStateFromError&&(t.setState(o.getDerivedStateFromError(n)),r=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),r=t.__d),r)return t.__E=t}catch(l){n=l;}throw n}},u$1=0,_$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a$1({},this.state),"function"==typeof n&&(n=n(a$1({},u),this.props)),n&&a$1(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m$1(this));},_$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m$1(this));},_$1.prototype.render=d$1,t$2=[],o$2="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g$2.__r=0,f$1=0;

var t$1,u,r,o$1,i=0,c=[],f=[],e$1=l$1.__b,a=l$1.__r,v=l$1.diffed,l=l$1.__c,m=l$1.unmount;function p(t,r){l$1.__h&&l$1.__h(u,t,i||r),i=0;var o=u.__H||(u.__H={__:[],__h:[]});return t>=o.__.length&&o.__.push({__V:f}),o.__[t]}function y(n){return i=1,d(z$1,n)}function d(n,r,o){var i=p(t$1++,2);return i.t=n,i.__c||(i.__=[o?o(r):z$1(void 0,r),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}));}],i.__c=u),i.__}function _(r,o){var i=p(t$1++,3);!l$1.__s&&w$1(i.__H,o)&&(i.__=r,i.u=o,u.__H.__h.push(i));}function h(r,o){var i=p(t$1++,4);!l$1.__s&&w$1(i.__H,o)&&(i.__=r,i.u=o,u.__h.push(i));}function s(n){return i=5,F$1(function(){return {current:n}},[])}function A$1(n,t,u){i=6,h(function(){return "function"==typeof n?(n(t()),function(){return n(null)}):n?(n.current=t(),function(){return n.current=null}):void 0},null==u?u:u.concat(n));}function F$1(n,u){var r=p(t$1++,7);return w$1(r.__H,u)?(r.__V=n(),r.u=u,r.__h=n,r.__V):r.__}function T$1(n,t){return i=8,F$1(function(){return n},t)}function q$1(n){var r=u.context[n.__c],o=p(t$1++,9);return o.c=n,r?(null==o.__&&(o.__=!0,r.sub(u)),r.props.value):n.__}function x$1(t,u){l$1.useDebugValue&&l$1.useDebugValue(u?u(t):t);}function b(){for(var t;t=c.shift();)if(t.__P)try{t.__H.__h.forEach(j$1),t.__H.__h.forEach(k$1),t.__H.__h=[];}catch(u){t.__H.__h=[],l$1.__e(u,t.__v);}}l$1.__b=function(n){u=null,e$1&&e$1(n);},l$1.__r=function(n){a&&a(n),t$1=0;var o=(u=n.__c).__H;o&&(r===u?(o.__h=[],u.__h=[],o.__.forEach(function(n){n.__V=f,n.u=void 0;})):(o.__h.forEach(j$1),o.__h.forEach(k$1),o.__h=[])),r=u;},l$1.diffed=function(t){v&&v(t);var i=t.__c;i&&i.__H&&(i.__H.__h.length&&(1!==c.push(i)&&o$1===l$1.requestAnimationFrame||((o$1=l$1.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),g$1&&cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);g$1&&(t=requestAnimationFrame(u));})(b)),i.__H.__.forEach(function(n){n.u&&(n.__H=n.u),n.__V!==f&&(n.__=n.__V),n.u=void 0,n.__V=f;})),r=u=null;},l$1.__c=function(t,u){u.some(function(t){try{t.__h.forEach(j$1),t.__h=t.__h.filter(function(n){return !n.__||k$1(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],l$1.__e(r,t.__v);}}),l&&l(t,u);},l$1.unmount=function(t){m&&m(t);var u,r=t.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{j$1(n);}catch(n){u=n;}}),u&&l$1.__e(u,r.__v));};var g$1="function"==typeof requestAnimationFrame;function j$1(n){var t=u,r=n.__c;"function"==typeof r&&(n.__c=void 0,r()),u=t;}function k$1(n){var t=u;n.__c=n.__(),u=t;}function w$1(n,t){return !n||n.length!==t.length||t.some(function(t,u){return t!==n[u]})}function z$1(n,t){return "function"==typeof t?t(n):t}

function S(n,t){for(var e in t)n[e]=t[e];return n}function C(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function E(n){this.props=n;}function g(n,t){function e(n){var e=this.props.ref,r=e==n.ref;return !r&&e&&(e.call?e(null):e.current=null),t?!t(this.props,n)||!r:C(this.props,n)}function r(t){return this.shouldComponentUpdate=e,v$1(n,t)}return r.displayName="Memo("+(n.displayName||n.name)+")",r.prototype.isReactComponent=!0,r.__f=!0,r}(E.prototype=new _$1).isPureReactComponent=!0,E.prototype.shouldComponentUpdate=function(n,t){return C(this.props,n)||C(this.state,t)};var w=l$1.__b;l$1.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),w&&w(n);};var x="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function R(n){function t(t){var e=S({},t);return delete e.ref,n(e,t.ref||null)}return t.$$typeof=x,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var N=function(n,t){return null==n?null:A$2(A$2(n).map(t))},k={map:N,forEach:N,count:function(n){return n?A$2(n).length:0},only:function(n){var t=A$2(n);if(1!==t.length)throw "Children.only";return t[0]},toArray:A$2},A=l$1.__e;l$1.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);A(n,t,e,r);};var O=l$1.unmount;function T(){this.__u=0,this.t=null,this.__b=null;}function L(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function U(n){var t,e,r;function u(u){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return v$1(e,u)}return u.displayName="Lazy",u.__f=!0,u}function D(){this.u=null,this.o=null;}l$1.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&!0===n.__h&&(n.type=null),O&&O(n);},(T.prototype=new _$1).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=L(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(l):l());};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=function n(t,e,r){return t&&(t.__v=null,t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)}),t.__c&&t.__c.__P===e&&(t.__e&&r.insertBefore(t.__e,t.__d),t.__c.__e=!0,t.__c.__P=r)),t}(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate();}},f=!0===t.__h;r.__u++||f||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i);},T.prototype.componentWillUnmount=function(){this.t=[];},T.prototype.render=function(n,t){if(this.__b){if(this.__v.__k){var e=document.createElement("div"),r=this.__v.__k[0].__c;this.__v.__k[0]=function n(t,e,r){return t&&(t.__c&&t.__c.__H&&(t.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),t.__c.__H=null),null!=(t=S({},t)).__c&&(t.__c.__P===r&&(t.__c.__P=e),t.__c=null),t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)})),t}(this.__b,e,r.__O=r.__P);}this.__b=null;}var u=t.__a&&v$1(d$1,null,n.fallback);return u&&(u.__h=null),[v$1(d$1,null,t.__a?null:n.children),u]};var F=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};function I(n){return this.getChildContext=function(){return n.context},n.children}function M(n){var t=this,e=n.i;t.componentWillUnmount=function(){S$1(null,t.l),t.l=null,t.i=null;},t.i&&t.i!==e&&t.componentWillUnmount(),n.__v?(t.l||(t.i=e,t.l={nodeType:1,parentNode:e,childNodes:[],appendChild:function(n){this.childNodes.push(n),t.i.appendChild(n);},insertBefore:function(n,e){this.childNodes.push(n),t.i.appendChild(n);},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),t.i.removeChild(n);}}),S$1(v$1(I,{context:t.context},n.__v),t.l)):t.l&&t.componentWillUnmount();}function V(n,t){var e=v$1(M,{__v:n,i:t});return e.containerInfo=t,e}(D.prototype=new _$1).__a=function(n){var t=this,e=L(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),F(t,n,r)):u();};e?e(o):o();}},D.prototype.render=function(n){this.u=null,this.o=new Map;var t=A$2(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},D.prototype.componentDidUpdate=D.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){F(n,e,t);});};var W="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,P=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|shape|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,$="undefined"!=typeof document,j=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(n)};function z(n,t,e){return null==t.__k&&(t.textContent=""),S$1(n,t),"function"==typeof e&&e(),n?n.__c:null}function B(n,t,e){return q$2(n,t),"function"==typeof e&&e(),n?n.__c:null}_$1.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(n){Object.defineProperty(_$1.prototype,n,{configurable:!0,get:function(){return this["UNSAFE_"+n]},set:function(t){Object.defineProperty(this,n,{configurable:!0,writable:!0,value:t});}});});var H=l$1.event;function Z(){}function Y(){return this.cancelBubble}function q(){return this.defaultPrevented}l$1.event=function(n){return H&&(n=H(n)),n.persist=Z,n.isPropagationStopped=Y,n.isDefaultPrevented=q,n.nativeEvent=n};var G,J={configurable:!0,get:function(){return this.class}},K=l$1.vnode;l$1.vnode=function(n){var t=n.type,e=n.props,r=e;if("string"==typeof t){var u=-1===t.indexOf("-");for(var o in r={},e){var i=e[o];$&&"children"===o&&"noscript"===t||"value"===o&&"defaultValue"in e&&null==i||("defaultValue"===o&&"value"in e&&null==e.value?o="value":"download"===o&&!0===i?i="":/ondoubleclick/i.test(o)?o="ondblclick":/^onchange(textarea|input)/i.test(o+t)&&!j(e.type)?o="oninput":/^onfocus$/i.test(o)?o="onfocusin":/^onblur$/i.test(o)?o="onfocusout":/^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(o)?o=o.toLowerCase():u&&P.test(o)?o=o.replace(/[A-Z0-9]/,"-$&").toLowerCase():null===i&&(i=void 0),/^oninput$/i.test(o)&&(o=o.toLowerCase(),r[o]&&(o="oninputCapture")),r[o]=i);}"select"==t&&r.multiple&&Array.isArray(r.value)&&(r.value=A$2(e.children).forEach(function(n){n.props.selected=-1!=r.value.indexOf(n.props.value);})),"select"==t&&null!=r.defaultValue&&(r.value=A$2(e.children).forEach(function(n){n.props.selected=r.multiple?-1!=r.defaultValue.indexOf(n.props.value):r.defaultValue==n.props.value;})),n.props=r,e.class!=e.className&&(J.enumerable="className"in e,null!=e.className&&(r.class=e.className),Object.defineProperty(r,"className",J));}n.$$typeof=W,K&&K(n);};var Q=l$1.__r;l$1.__r=function(n){Q&&Q(n),G=n.__c;};var X={ReactCurrentDispatcher:{current:{readContext:function(n){return G.__n[n.__c].props.value}}}};function tn(n){return v$1.bind(null,n)}function en(n){return !!n&&n.$$typeof===W}function rn(n){return en(n)?B$1.apply(null,arguments):n}function un(n){return !!n.__k&&(S$1(null,n),!0)}function on(n){return n&&(n.base||1===n.nodeType&&n)||null}var ln=function(n,t){return n(t)},fn=function(n,t){return n(t)};function an(n){n();}function sn(n){return n}function hn(){return [!1,an]}function dn(t,r){var u=y(r),o=u[0],i=u[1];return _(function(){return t(function(){i(r());})},[t,r]),o}var React = {useState:y,useReducer:d,useEffect:_,useLayoutEffect:h,useInsertionEffect:h,useTransition:hn,useDeferredValue:sn,useSyncExternalStore:dn,startTransition:an,useRef:s,useImperativeHandle:A$1,useMemo:F$1,useCallback:T$1,useContext:q$1,useDebugValue:x$1,version:"17.0.2",Children:k,render:z,hydrate:B,unmountComponentAtNode:un,createPortal:V,createElement:v$1,createContext:D$1,createFactory:tn,cloneElement:rn,createRef:p$1,Fragment:d$1,isValidElement:en,findDOMNode:on,Component:_$1,PureComponent:E,memo:g,forwardRef:R,flushSync:fn,unstable_batchedUpdates:ln,StrictMode:d$1,Suspense:T,SuspenseList:D,lazy:U,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:X};

var o=0;function e(_,e,n,t,f){var l,s,u={};for(s in e)"ref"==s?l=e[s]:u[s]=e[s];var a={type:_,props:u,key:n,ref:l,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--o,__source:f,__self:t};if("function"==typeof _&&(l=_.defaultProps))for(s in l)void 0===u[s]&&(u[s]=l[s]);return l$1.vnode&&l$1.vnode(a),a}

function createContextByFields(fields) {
  const keys = Object.keys(fields);
  const instances = keys.reduce((acc, fieldKey) => {
    const ClassName = fields[fieldKey];
    acc[fieldKey] = Container$n.get(ClassName);
    return acc;
  }, {}); // @ts-ignore

  return D$1.call(this, instances);
}

function hookContextFactory(fields) {
  let cachedContext = null;

  const useModuleContext = () => {
    if (cachedContext === null) {
      cachedContext = createContextByFields(fields);
    }

    return q$1(cachedContext);
  };

  return {
    useModuleContext
  };
}

const PREFIX = '@finanso:';
class LocalStorageItem {
  get usedKey() {
    return `${PREFIX}-${this.key}`;
  }

  set(value) {
    this.value = value;

    try {
      const storedValue = JSON.stringify({
        value
      });
      window.localStorage.setItem(this.usedKey, storedValue);
    } catch (e) {}
  }

  getValue() {
    const storedValue = window.localStorage.getItem(this.usedKey);

    if (!storedValue) {
      var ref;
      return (ref = this.options) === null || ref === void 0 ? void 0 : ref.initialValue;
    }

    try {
      var ref1;
      const result = JSON.parse(storedValue);
      if (!result) return (ref1 = this.options) === null || ref1 === void 0 ? void 0 : ref1.initialValue;
      return result.value;
    } catch (e) {}
  }

  remove() {
    return window.localStorage.removeItem(this.usedKey);
  }

  constructor(key, options) {
    this.key = key;
    this.options = options;
    this.value = this.getValue();
    window.addEventListener('storage', event => {
      if (!event.key || event.key === this.usedKey) {
        this.value = this.getValue();
      }
    });
    makeObservable(this, {
      value: observable
    });
  }

}

var __decorate$L = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const DEFAULT_VALUE = 'light';
let ThemeStore = class ThemeStore {
  get currentTheme() {
    return this.themeStorage.value || DEFAULT_VALUE;
  }

  changeTheme(value) {
    this.themeStorage.set(value);
  }

  constructor() {
    this.themeStorage = new LocalStorageItem('theme', {
      initialValue: DEFAULT_VALUE
    });
  }

};
ThemeStore = __decorate$L([Store()], ThemeStore);

var __decorate$K = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$r = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$r = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ThemeAction = class ThemeAction {
  handleToggleTheme() {
    const theme = this.themeStore.currentTheme;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    this.themeStore.changeTheme(newTheme);
  }

  constructor(themeStore) {
    this.themeStore = themeStore;
  }

};
ThemeAction = __decorate$K([Action(), __param$r(0, Inject()), __metadata$r("design:type", Function), __metadata$r("design:paramtypes", [typeof ThemeStore === "undefined" ? Object : ThemeStore])], ThemeAction);

const {
  useModuleContext: useThemeContext
} = hookContextFactory({
  themeAction: ThemeAction,
  themeStore: ThemeStore
});

if (!y) {
    throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!makeObservable) {
    throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
}

function defaultNoopBatch(callback) {
    callback();
}
function observerBatching(reactionScheduler) {
    if (!reactionScheduler) {
        reactionScheduler = defaultNoopBatch;
    }
    configure({ reactionScheduler: reactionScheduler });
}

function printDebugValue(v) {
    return getDependencyTree(v);
}

var FinalizationRegistryLocal = typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry;

function createTrackingData(reaction) {
    var trackingData = {
        reaction: reaction,
        mounted: false,
        changedBeforeMount: false,
        cleanAt: Date.now() + CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS
    };
    return trackingData;
}
/**
 * The minimum time before we'll clean up a Reaction created in a render
 * for a component that hasn't managed to run its effects. This needs to
 * be big enough to ensure that a component won't turn up and have its
 * effects run without being re-rendered.
 */
var CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS = 10000;
/**
 * The frequency with which we'll check for leaked reactions.
 */
var CLEANUP_TIMER_LOOP_MILLIS = 10000;

/**
 * FinalizationRegistry-based uncommitted reaction cleanup
 */
function createReactionCleanupTrackingUsingFinalizationRegister(FinalizationRegistry) {
    var cleanupTokenToReactionTrackingMap = new Map();
    var globalCleanupTokensCounter = 1;
    var registry = new FinalizationRegistry(function cleanupFunction(token) {
        var trackedReaction = cleanupTokenToReactionTrackingMap.get(token);
        if (trackedReaction) {
            trackedReaction.reaction.dispose();
            cleanupTokenToReactionTrackingMap.delete(token);
        }
    });
    return {
        addReactionToTrack: function (reactionTrackingRef, reaction, objectRetainedByReact) {
            var token = globalCleanupTokensCounter++;
            registry.register(objectRetainedByReact, token, reactionTrackingRef);
            reactionTrackingRef.current = createTrackingData(reaction);
            reactionTrackingRef.current.finalizationRegistryCleanupToken = token;
            cleanupTokenToReactionTrackingMap.set(token, reactionTrackingRef.current);
            return reactionTrackingRef.current;
        },
        recordReactionAsCommitted: function (reactionRef) {
            registry.unregister(reactionRef);
            if (reactionRef.current && reactionRef.current.finalizationRegistryCleanupToken) {
                cleanupTokenToReactionTrackingMap.delete(reactionRef.current.finalizationRegistryCleanupToken);
            }
        },
        forceCleanupTimerToRunNowForTests: function () {
            // When FinalizationRegistry in use, this this is no-op
        },
        resetCleanupScheduleForTests: function () {
            // When FinalizationRegistry in use, this this is no-op
        }
    };
}

var __values = (globalThis && globalThis.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * timers, gc-style, uncommitted reaction cleanup
 */
function createTimerBasedReactionCleanupTracking() {
    /**
     * Reactions created by components that have yet to be fully mounted.
     */
    var uncommittedReactionRefs = new Set();
    /**
     * Latest 'uncommitted reactions' cleanup timer handle.
     */
    var reactionCleanupHandle;
    /* istanbul ignore next */
    /**
     * Only to be used by test functions; do not export outside of mobx-react-lite
     */
    function forceCleanupTimerToRunNowForTests() {
        // This allows us to control the execution of the cleanup timer
        // to force it to run at awkward times in unit tests.
        if (reactionCleanupHandle) {
            clearTimeout(reactionCleanupHandle);
            cleanUncommittedReactions();
        }
    }
    /* istanbul ignore next */
    function resetCleanupScheduleForTests() {
        var e_1, _a;
        if (uncommittedReactionRefs.size > 0) {
            try {
                for (var uncommittedReactionRefs_1 = __values(uncommittedReactionRefs), uncommittedReactionRefs_1_1 = uncommittedReactionRefs_1.next(); !uncommittedReactionRefs_1_1.done; uncommittedReactionRefs_1_1 = uncommittedReactionRefs_1.next()) {
                    var ref = uncommittedReactionRefs_1_1.value;
                    var tracking = ref.current;
                    if (tracking) {
                        tracking.reaction.dispose();
                        ref.current = null;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (uncommittedReactionRefs_1_1 && !uncommittedReactionRefs_1_1.done && (_a = uncommittedReactionRefs_1.return)) _a.call(uncommittedReactionRefs_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            uncommittedReactionRefs.clear();
        }
        if (reactionCleanupHandle) {
            clearTimeout(reactionCleanupHandle);
            reactionCleanupHandle = undefined;
        }
    }
    function ensureCleanupTimerRunning() {
        if (reactionCleanupHandle === undefined) {
            reactionCleanupHandle = setTimeout(cleanUncommittedReactions, CLEANUP_TIMER_LOOP_MILLIS);
        }
    }
    function scheduleCleanupOfReactionIfLeaked(ref) {
        uncommittedReactionRefs.add(ref);
        ensureCleanupTimerRunning();
    }
    function recordReactionAsCommitted(reactionRef) {
        uncommittedReactionRefs.delete(reactionRef);
    }
    /**
     * Run by the cleanup timer to dispose any outstanding reactions
     */
    function cleanUncommittedReactions() {
        reactionCleanupHandle = undefined;
        // Loop through all the candidate leaked reactions; those older
        // than CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS get tidied.
        var now = Date.now();
        uncommittedReactionRefs.forEach(function (ref) {
            var tracking = ref.current;
            if (tracking) {
                if (now >= tracking.cleanAt) {
                    // It's time to tidy up this leaked reaction.
                    tracking.reaction.dispose();
                    ref.current = null;
                    uncommittedReactionRefs.delete(ref);
                }
            }
        });
        if (uncommittedReactionRefs.size > 0) {
            // We've just finished a round of cleanups but there are still
            // some leak candidates outstanding.
            ensureCleanupTimerRunning();
        }
    }
    return {
        addReactionToTrack: function (reactionTrackingRef, reaction, 
        /**
         * On timer based implementation we don't really need this object,
         * but we keep the same api
         */
        objectRetainedByReact) {
            reactionTrackingRef.current = createTrackingData(reaction);
            scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
            return reactionTrackingRef.current;
        },
        recordReactionAsCommitted: recordReactionAsCommitted,
        forceCleanupTimerToRunNowForTests: forceCleanupTimerToRunNowForTests,
        resetCleanupScheduleForTests: resetCleanupScheduleForTests
    };
}

var _a$2 = FinalizationRegistryLocal
    ? createReactionCleanupTrackingUsingFinalizationRegister(FinalizationRegistryLocal)
    : createTimerBasedReactionCleanupTracking(), addReactionToTrack = _a$2.addReactionToTrack, recordReactionAsCommitted = _a$2.recordReactionAsCommitted;

var __read = (globalThis && globalThis.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
function observerComponentNameFor(baseComponentName) {
    return "observer".concat(baseComponentName);
}
/**
 * We use class to make it easier to detect in heap snapshots by name
 */
var ObjectToBeRetainedByReact = /** @class */ (function () {
    function ObjectToBeRetainedByReact() {
    }
    return ObjectToBeRetainedByReact;
}());
function objectToBeRetainedByReactFactory() {
    return new ObjectToBeRetainedByReact();
}
function useObserver(fn, baseComponentName) {
    if (baseComponentName === void 0) { baseComponentName = "observed"; }
    var _a = __read(React.useState(objectToBeRetainedByReactFactory), 1), objectRetainedByReact = _a[0];
    // Force update, see #2982
    var _b = __read(React.useState(), 2), setState = _b[1];
    var forceUpdate = function () { return setState([]); };
    // StrictMode/ConcurrentMode/Suspense may mean that our component is
    // rendered and abandoned multiple times, so we need to track leaked
    // Reactions.
    var reactionTrackingRef = React.useRef(null);
    if (!reactionTrackingRef.current) {
        // First render for this component (or first time since a previous
        // reaction from an abandoned render was disposed).
        var newReaction = new Reaction(observerComponentNameFor(baseComponentName), function () {
            // Observable has changed, meaning we want to re-render
            // BUT if we're a component that hasn't yet got to the useEffect()
            // stage, we might be a component that _started_ to render, but
            // got dropped, and we don't want to make state changes then.
            // (It triggers warnings in StrictMode, for a start.)
            if (trackingData_1.mounted) {
                // We have reached useEffect(), so we're mounted, and can trigger an update
                forceUpdate();
            }
            else {
                // We haven't yet reached useEffect(), so we'll need to trigger a re-render
                // when (and if) useEffect() arrives.
                trackingData_1.changedBeforeMount = true;
            }
        });
        var trackingData_1 = addReactionToTrack(reactionTrackingRef, newReaction, objectRetainedByReact);
    }
    var reaction = reactionTrackingRef.current.reaction;
    React.useDebugValue(reaction, printDebugValue);
    React.useEffect(function () {
        // Called on first mount only
        recordReactionAsCommitted(reactionTrackingRef);
        if (reactionTrackingRef.current) {
            // Great. We've already got our reaction from our render;
            // all we need to do is to record that it's now mounted,
            // to allow future observable changes to trigger re-renders
            reactionTrackingRef.current.mounted = true;
            // Got a change before first mount, force an update
            if (reactionTrackingRef.current.changedBeforeMount) {
                reactionTrackingRef.current.changedBeforeMount = false;
                forceUpdate();
            }
        }
        else {
            // The reaction we set up in our render has been disposed.
            // This can be due to bad timings of renderings, e.g. our
            // component was paused for a _very_ long time, and our
            // reaction got cleaned up
            // Re-create the reaction
            reactionTrackingRef.current = {
                reaction: new Reaction(observerComponentNameFor(baseComponentName), function () {
                    // We've definitely already been mounted at this point
                    forceUpdate();
                }),
                mounted: true,
                changedBeforeMount: false,
                cleanAt: Infinity
            };
            forceUpdate();
        }
        return function () {
            reactionTrackingRef.current.reaction.dispose();
            reactionTrackingRef.current = null;
        };
    }, []);
    // render the original component, but have the
    // reaction track the observables, so that rendering
    // can be invalidated (see above) once a dependency changes
    var rendering;
    var exception;
    reaction.track(function () {
        try {
            rendering = fn();
        }
        catch (e) {
            exception = e;
        }
    });
    if (exception) {
        throw exception; // re-throw any exceptions caught during rendering
    }
    return rendering;
}

var hasSymbol = typeof Symbol === "function" && Symbol.for;
// Using react-is had some issues (and operates on elements, not on types), see #608 / #609
var ReactForwardRefSymbol = hasSymbol
    ? Symbol.for("react.forward_ref")
    : typeof R === "function" && R(function (props) { return null; })["$$typeof"];
var ReactMemoSymbol = hasSymbol
    ? Symbol.for("react.memo")
    : typeof g === "function" && g(function (props) { return null; })["$$typeof"];
// n.b. base case is not used for actual typings or exported in the typing files
function observer(baseComponent, 
// TODO remove in next major
options) {
    var _a;
    if (ReactMemoSymbol && baseComponent["$$typeof"] === ReactMemoSymbol) {
        throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");
    }
    var useForwardRef = (_a = options === null || options === void 0 ? void 0 : options.forwardRef) !== null && _a !== void 0 ? _a : false;
    var render = baseComponent;
    var baseComponentName = baseComponent.displayName || baseComponent.name;
    // If already wrapped with forwardRef, unwrap,
    // so we can patch render and apply memo
    if (ReactForwardRefSymbol && baseComponent["$$typeof"] === ReactForwardRefSymbol) {
        useForwardRef = true;
        render = baseComponent["render"];
        if (typeof render !== "function") {
            throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");
        }
    }
    var observerComponent = function (props, ref) {
        return useObserver(function () { return render(props, ref); }, baseComponentName);
    };
    // Don't set `displayName` for anonymous components,
    // so the `displayName` can be customized by user, see #3192.
    if (baseComponentName !== "") {
        observerComponent.displayName = baseComponentName;
    }
    // Support legacy context: `contextTypes` must be applied before `memo`
    if (baseComponent.contextTypes) {
        observerComponent.contextTypes = baseComponent.contextTypes;
    }
    if (useForwardRef) {
        // `forwardRef` must be applied prior `memo`
        // `forwardRef(observer(cmp))` throws:
        // "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))"
        observerComponent = R(observerComponent);
    }
    // memo; we are not interested in deep updates
    // in props; we assume that if deep objects are changed,
    // this is in observables, which would have been tracked anyway
    observerComponent = g(observerComponent);
    copyStaticProperties(baseComponent, observerComponent);
    return observerComponent;
}
// based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
var hoistBlackList = {
    $$typeof: true,
    render: true,
    compare: true,
    type: true,
    // Don't redefine `displayName`,
    // it's defined as getter-setter pair on `memo` (see #3192).
    displayName: true
};
function copyStaticProperties(base, target) {
    Object.keys(base).forEach(function (key) {
        if (!hoistBlackList[key]) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
    });
}

(globalThis && globalThis.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};

observerBatching(ln);

function getClassName(classNames, oldClass, newClass) {
  const names = classNames.split(' ').filter(value => {
    const isExist = value.trim() === newClass || value.trim() === oldClass;
    return !isExist;
  });
  names.push(newClass);
  return names.join(' ').trim();
}
function getClearedClass(classNames, clearClass) {
  return classNames.split(clearClass).join('');
}

const THEME_PREFIX = 'theme-';
const ANIMATE_CLASS = 'theme-animate';
const CHANGE_TIMEOUT = 1200;
function useTheme() {
  const {
    themeStore
  } = useThemeContext();
  _(() => {
    const themeValue = themeStore.currentTheme;
    const root = document.getElementsByTagName('html')[0];
    const oldTheme = themeValue === 'light' ? 'dark' : 'light';
    const cleanupClasses = getClearedClass(root.className, ANIMATE_CLASS);
    const newThemeClassNames = getClassName(cleanupClasses, `${THEME_PREFIX}${oldTheme}`, `${THEME_PREFIX}${themeValue}`);
    root.className = getClassName(newThemeClassNames, ANIMATE_CLASS, ANIMATE_CLASS);
    const timerId = window.setTimeout(() => {
      root.className = newThemeClassNames;
    }, CHANGE_TIMEOUT);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [themeStore.currentTheme]);
}

const ThemeDefine = observer(() => {
  useTheme();
  return null;
});

/**
   * @license
   * author: dudiq
   * jr-translate.js v2.0.0
   * Released under the MIT license.
   */

const n = typeof navigator === 'object' ? navigator : undefined;
const DEF_LANG = 'en';
class Languages {
    defaultLanguage = DEF_LANG;
    currentLanguage = ((n && n.language) || '').substring(0, 2).toLowerCase() || DEF_LANG;
    languageList = [DEF_LANG];
    setDefaultLanguage(lang) {
        this.defaultLanguage = lang;
    }
    setLanguage(value) {
        this.currentLanguage = value;
    }
    setLanguageList(value) {
        this.languageList = value;
    }
}
const langs = new Languages();

const isClient = typeof window !== 'undefined';
const canUseFormatter = isClient ? !!window.Intl : true; // support for old browsers;
const map = {};
function getNumByLang(lang, number) {
    if (map[lang] !== false) {
        // init
        map[lang] = canUseFormatter ? new Intl.NumberFormat(lang) : false;
    }
    const node = map[lang];
    if (isNaN(number) || node === false) {
        return number + '';
    }
    return node.format(number);
}
function numberFormat(lang, number, precision) {
    if (precision === undefined) {
        return getNumByLang(lang, number);
    }
    const dx = Math.pow(10, precision);
    const bigNum = Math.floor(number * dx);
    const floatDx = 1 / (dx * 10);
    const int = Math.floor(number);
    let float = Math.floor(bigNum - int * dx) / dx;
    float += floatDx;
    const localeInt = getNumByLang(lang, int);
    let localeFloat = getNumByLang(lang, float);
    localeFloat = localeFloat.substring(1, localeFloat.length - 1);
    return localeInt + (localeFloat.length > 1 ? localeFloat : '');
}
function getNumber(lang, number, precision) {
    if (typeof lang === 'number') {
        return numberFormat(langs.currentLanguage, lang, number);
    }
    return numberFormat(lang, number, precision);
}

const pluEn = {
    lang: 'en',
    getIndex: (num) => {
        return num !== 1 ? 1 : 0;
    },
};

const pluRu = {
    lang: 'ru',
    getIndex: (num) => {
        return num % 10 == 1 && num % 100 != 11
            ? 0
            : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
                ? 1
                : 2;
    },
};

const pluEs = {
    lang: 'es',
    getIndex: (num) => {
        return num !== 1 ? 1 : 0;
    },
};

const pluFr = {
    lang: 'fr',
    getIndex: (num) => {
        return num > 1 ? 1 : 0;
    },
};

const canUseConsole = typeof console == 'object';
function logError(...args) {
    if (!canUseConsole)
        return;
    console.error('#translate:', ...args);
}

const pluralMap = {};
function addPlural$1(plu) {
    if (pluralMap[plu.lang]) {
        logError(`trying register already defined plural - ${plu.lang}`);
        return;
    }
    pluralMap[plu.lang] = plu;
}
function plurals(lang, pluralFields, data) {
    const plu = pluralMap[lang];
    let ret = pluralFields.key || '';
    const isObject = typeof data === 'object';
    for (const key in pluralFields) {
        if (key === 'key')
            continue;
        const num = (isObject ? data[key] : data);
        const pluArray = pluralFields[key];
        const index = plu.getIndex(num);
        let pluStr = pluArray ? pluArray[index] : '';
        const numFormatted = numberFormat(lang, num);
        pluStr = pluStr.replace('{#}', numFormatted);
        ret = ret.replace(`{#${key}}`, pluStr);
    }
    if (!isObject)
        return ret;
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(pluralFields, key))
            continue;
        const val = data[key];
        ret = ret.replace(`{#${key}}`, `${val}`);
    }
    return ret;
}
plurals.addPlural = function (plu) {
    if (!Array.isArray(plu)) {
        addPlural$1(plu);
        return;
    }
    plu.forEach(function (item) {
        addPlural$1(item);
    });
};
// default plurals
plurals.addPlural([pluEn, pluRu, pluEs, pluFr]);

const hashMap = {};
const DEF_SEPARATOR = '.';
function applyData(str, data) {
    if (!data)
        return str;
    if (typeof data !== 'object') {
        return str.replace('{#}', `${data}`);
    }
    let ret = str;
    for (const key in data) {
        const val = data[key];
        ret = ret.replace(`{#${key}}`, `${val}`);
    }
    return ret;
}
function onBlockParsed(langsList, hash, block) {
    if (Array.isArray(block)) {
        setToMap(block, langsList, hash, block);
    }
    else {
        setToMap(langsList, langsList, hash, block);
    }
}
function processKeyTree(nestedTree, langsList, hash, separator) {
    if (typeof nestedTree !== 'object' || Array.isArray(nestedTree)) {
        onBlockParsed(langsList, hash, nestedTree);
        return;
    }
    for (const key in nestedTree) {
        const newHash = hash ? hash + separator + key : key;
        const block = nestedTree[key];
        processKeyTree(block, langsList, newHash, separator);
    }
}
function initLangs(lang) {
    hashMap[lang] = hashMap[lang] || {};
}
function parseBlock(block, langsList) {
    langsList.forEach(initLangs);
    processKeyTree(block, langsList, '', DEF_SEPARATOR);
}
function setToMap(list, langsList, hash, data) {
    for (let i = 0, l = list.length; i < l; i++) {
        const lang = langsList[i] || langs.defaultLanguage;
        const item = Array.isArray(data) ? data[i] : data;
        const langMap = hashMap[lang];
        if (langMap[hash]) {
            logError('trying to register already defined HASH lang!', hash);
        }
        else {
            hashMap[lang][hash] = item;
        }
    }
}
function getData(lang, field, data) {
    if (typeof field === 'object') {
        return plurals(lang, field, data);
    }
    return applyData(field, data);
}
function getBlockByKey(lang, key, data) {
    const translateBlock = hashMap[lang];
    if (translateBlock && translateBlock[key] !== undefined) {
        return getData(lang, translateBlock[key], data);
    }
    return;
}
function translate(key, data) {
    return translateByLang(langs.currentLanguage, key, data);
}
function translateByLang(lang, key, data) {
    const result = getBlockByKey(lang, key, data);
    if (result !== undefined) {
        return result;
    }
    logError(`not defined block [${key}] in ${lang} lang`);
    if (lang === langs.defaultLanguage) {
        return key;
    }
    const defaultResult = getBlockByKey(langs.defaultLanguage, key, data);
    if (defaultResult === undefined) {
        return key;
    }
    return defaultResult;
}
function addBlock(block) {
    parseBlock(block.data, block.langs || langs.languageList);
}

function getLang() {
    return langs.currentLanguage;
}
function setLangs(list) {
    langs.setLanguageList(list);
}
function setLang(lang) {
    langs.setLanguage(lang);
}

const t = translate;
function getMoney(val, precision = 2) {
  const view = (val - 0) / 100;
  return getNumber(view, precision);
}
setLangs(['en', 'ru']);

var __decorate$J = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let LangStore = class LangStore {
  get currentLanguage() {
    return this.langStorage.value || getLang();
  }

  changeLanguage(newLang) {
    this.langStorage.set(newLang);
    setLang(newLang);
  }

  constructor() {
    this.langStorage = new LocalStorageItem('lang', {
      initialValue: getLang()
    });
  }

};
LangStore = __decorate$J([Store()], LangStore);

var __decorate$I = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$q = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$q = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let LanguageAction = class LanguageAction {
  handleChangeLanguage() {
    const currentLang = getLang();
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    this.langStore.changeLanguage(newLang);
  }

  constructor(langStore) {
    this.langStore = langStore;
  }

};
LanguageAction = __decorate$I([Action(), __param$q(0, Inject()), __metadata$q("design:type", Function), __metadata$q("design:paramtypes", [typeof LangStore === "undefined" ? Object : LangStore])], LanguageAction);

const {
  useModuleContext: useLanguageContext
} = hookContextFactory({
  langAction: LanguageAction,
  langStore: LangStore
});

var __decorate$H = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let FocusStore = class FocusStore {
  setIsTyping(value) {
    this.isTyping = value;
  }

  constructor() {
    this.isTyping = false;
  }

};
FocusStore = __decorate$H([Store()], FocusStore);

var __decorate$G = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$p = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$p = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

const USED_NODES = {
  input: {
    type: {
      file: false,
      radio: false,
      checked: false
    }
  },
  textarea: true
};

function canPass(ev) {
  const el = ev.target;
  const nodeName = el.nodeName.toLowerCase(); // @ts-ignore

  const flags = USED_NODES[nodeName];

  if (!(flags && flags.type)) {
    return !!flags;
  } // @ts-ignore
  // eslint-disable-next-line no-prototype-builtins


  if (flags.type.hasOwnProperty(el.type) && flags.type[el.type] === false) {
    return false;
  }

  return !!flags;
}

let FocusAction = class FocusAction {
  handleStartTyping(ev) {
    const isTyping = canPass(ev);
    if (!isTyping) return;
    this.focusStore.setIsTyping(true);
  }

  handleStopTyping(ev) {
    const isTyping = canPass(ev);
    if (!isTyping) return;
    this.focusStore.setIsTyping(false);
  }

  constructor(focusStore) {
    this.focusStore = focusStore;
  }

};
FocusAction = __decorate$G([Action(), __param$p(0, Inject()), __metadata$p("design:type", Function), __metadata$p("design:paramtypes", [typeof FocusStore === "undefined" ? Object : FocusStore])], FocusAction);

const {
  useModuleContext: useFocusContext
} = hookContextFactory({
  focusStore: FocusStore,
  focusAction: FocusAction
});

function useFocus() {
  const {
    focusAction
  } = useFocusContext();
  _(() => {
    document.body.addEventListener('focus', focusAction.handleStartTyping, true);
    document.body.addEventListener('blur', focusAction.handleStopTyping, true);
    return () => {
      document.body.removeEventListener('focus', focusAction.handleStartTyping, true);
      document.body.removeEventListener('blur', focusAction.handleStopTyping, true);
    };
  }, [focusAction.handleStartTyping, focusAction.handleStopTyping]);
}

/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */
const eventPopstate = "popstate";
const eventPushState = "pushState";
const eventReplaceState = "replaceState";
const events = [eventPopstate, eventPushState, eventReplaceState];

var locationHook = ({ base = "" } = {}) => {
  const [{ path, search }, update] = y(() => ({
    path: currentPathname(base),
    search: location.search,
  })); // @see https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const prevHash = s(path + search);

  _(() => {
    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      const pathname = currentPathname(base);
      const search = location.search;
      const hash = pathname + search;

      if (prevHash.current !== hash) {
        prevHash.current = hash;
        update({ path: pathname, search });
      }
    };

    events.forEach((e) => addEventListener(e, checkForUpdates));

    // it's possible that an update has occurred between render and the effect handler,
    // so we run additional check on mount to catch these updates. Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates();

    return () => events.forEach((e) => removeEventListener(e, checkForUpdates));
  }, [base]);

  // the 2nd argument of the `useLocation` return value is a function
  // that allows to perform a navigation.
  //
  // the function reference should stay the same between re-renders, so that
  // it can be passed down as an element prop without any performance concerns.
  const navigate = T$1(
    (to, { replace = false } = {}) =>
      history[replace ? eventReplaceState : eventPushState](
        null,
        "",
        // handle nested routers and absolute paths
        to[0] === "~" ? to.slice(1) : base + to
      ),
    [base]
  );

  return [path, navigate];
};

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof history !== "undefined") {
  for (const type of [eventPushState, eventReplaceState]) {
    const original = history[type];

    history[type] = function () {
      const result = original.apply(this, arguments);
      const event = new Event(type);
      event.arguments = arguments;

      dispatchEvent(event);
      return result;
    };
  }
}

const currentPathname = (base, path = location.pathname) =>
  !path.toLowerCase().indexOf(base.toLowerCase())
    ? path.slice(base.length) || "/"
    : "~" + path;

// creates a matcher function
function makeMatcher(makeRegexpFn = pathToRegexp) {
  let cache = {};

  // obtains a cached regexp version of the pattern
  const getRegexp = (pattern) =>
    cache[pattern] || (cache[pattern] = makeRegexpFn(pattern));

  return (pattern, path) => {
    const { regexp, keys } = getRegexp(pattern || "");
    const out = regexp.exec(path);

    if (!out) return [false, null];

    // formats an object with matched params
    const params = keys.reduce((params, key, i) => {
      params[key.name] = out[i + 1];
      return params;
    }, {});

    return [true, params];
  };
}

// escapes a regexp string (borrowed from path-to-regexp sources)
// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202
const escapeRx = (str) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

// returns a segment representation in RegExp based on flags
// adapted and simplified version from path-to-regexp sources
const rxForSegment = (repeat, optional, prefix) => {
  let capture = repeat ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)";
  if (optional && prefix) capture = "(?:\\/" + capture + ")";
  return capture + (optional ? "?" : "");
};

const pathToRegexp = (pattern) => {
  const groupRx = /:([A-Za-z0-9_]+)([?+*]?)/g;

  let match = null,
    lastIndex = 0,
    keys = [],
    result = "";

  while ((match = groupRx.exec(pattern)) !== null) {
    const [_, segment, mod] = match;

    // :foo  [1]      (  )
    // :foo? [0 - 1]  ( o)
    // :foo+ [1 - ∞]  (r )
    // :foo* [0 - ∞]  (ro)
    const repeat = mod === "+" || mod === "*";
    const optional = mod === "?" || mod === "*";
    const prefix = optional && pattern[match.index - 1] === "/" ? 1 : 0;

    const prev = pattern.substring(lastIndex, match.index - prefix);

    keys.push({ name: segment });
    lastIndex = groupRx.lastIndex;

    result += escapeRx(prev) + rxForSegment(repeat, optional, prefix);
  }

  result += escapeRx(pattern.substring(lastIndex));
  return { keys, regexp: new RegExp("^" + result + "(?:\\/)?$", "i") };
};

/*
 * Part 1, Hooks API: useRouter, useRoute and useLocation
 */

// one of the coolest features of `createContext`:
// when no value is provided — default object is used.
// allows us to use the router context as a global ref to store
// the implicitly created router (see `useRouter` below)
const RouterCtx = D$1({});

const buildRouter = ({
  hook = locationHook,
  base = "",
  matcher = makeMatcher(),
} = {}) => ({ hook, base, matcher });

const useRouter = () => {
  const globalRef = q$1(RouterCtx);

  // either obtain the router from the outer context (provided by the
  // `<Router /> component) or create an implicit one on demand.
  return globalRef.v || (globalRef.v = buildRouter());
};

const useLocation = () => {
  const router = useRouter();
  return router.hook(router);
};

/*
 * Part 2, Low Carb Router API: Router, Route, Link, Switch
 */

const Router = (props) => {
  const ref = s();

  // this little trick allows to avoid having unnecessary
  // calls to potentially expensive `buildRouter` method.
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const value = ref.current || (ref.current = { v: buildRouter(props) });

  return v$1(RouterCtx.Provider, {
    value,
    children: props.children,
  });
};

var __decorate$F = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let RoutesStore = class RoutesStore {
  addRoutes(newRoutes) {
    this.routeList = [...this.routeList, ...newRoutes];
  }

  get routes() {
    return this.routeList;
  }

  constructor() {
    this.routeList = [];
  }

};
RoutesStore = __decorate$F([Store()], RoutesStore);

const {
  useModuleContext: useRoutesContext
} = hookContextFactory({
  routesStore: RoutesStore
});

var __decorate$E = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let HistoryStore = class HistoryStore {
  updateState(pathname) {
    if (pathname !== this.pathname) {
      this.pathname = pathname;
    }
  }

  constructor() {
    this.pathname = '';
  }

};
HistoryStore = __decorate$E([Store()], HistoryStore);

var __decorate$D = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let RouterHistory = class RouterHistory {
  setHistory(history) {
    if (this.historyInstance !== history) {
      this.historyInstance = history;
    }
  }

  get history() {
    return this.historyInstance;
  }

  constructor() {
    this.historyInstance = null;
  }

};
RouterHistory = __decorate$D([Service()], RouterHistory);

const {
  useModuleContext: useHistoryContext
} = hookContextFactory({
  routerHistory: RouterHistory,
  historyStore: HistoryStore
});

function useCurrentRoute() {
  const {
    routesStore
  } = useRoutesContext();
  const {
    historyStore
  } = useHistoryContext();
  const router = useRouter();
  const pathname = historyStore.pathname.split('?')[0];
  const currentRoute = F$1(() => {
    const matchedRoute = routesStore.routes.find(route => {
      const [isMatched] = router.matcher(route.route.path || '', pathname);
      return isMatched;
    });
    if (matchedRoute) return matchedRoute; // return not found page

    return routesStore.routes.find(route => !route.route.path);
  }, [pathname, router, routesStore.routes]);
  return {
    currentRoute
  };
}

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var index = memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

/**
 * Takes a list of class names and filters for truthy ones, joining them into a single class name for convenience.
 * eg.
 * ```js
 *  cx('red', isBig && 'big') // returns 'red big' if `isBig` is true, otherwise returns 'red'
 * ```
 * If space separated atomic styles are provided, they are deduplicated according to the first hashed valued:
 *
 * ```js
 *  cx('atm_a_class1 atm_b_class2', 'atm_a_class3') // returns `atm_a_class3 atm_b_class2`
 * ```
 *
 * @returns the combined, space separated class names that can be applied directly to the class attribute
 */
const cx = function cx() {
  const presentClassNames = Array.prototype.slice // eslint-disable-next-line prefer-rest-params
  .call(arguments).filter(Boolean);
  const atomicClasses = {};
  const nonAtomicClasses = [];
  presentClassNames.forEach(arg => {
    // className could be the output of a previous cx call, so split by ' ' first
    const individualClassNames = arg ? arg.split(' ') : [];
    individualClassNames.forEach(className => {
      if (className.startsWith('atm_')) {
        const [, keyHash] = className.split('_');
        atomicClasses[keyHash] = className;
      } else {
        nonAtomicClasses.push(className);
      }
    });
  });
  const result = []; // eslint-disable-next-line no-restricted-syntax

  for (const keyHash in atomicClasses) {
    if (Object.prototype.hasOwnProperty.call(atomicClasses, keyHash)) {
      result.push(atomicClasses[keyHash]);
    }
  }

  result.push(...nonAtomicClasses);
  return result.join(' ');
};

var cx$1 = cx;

/* eslint-disable @typescript-eslint/no-explicit-any */

const isCapital = ch => ch.toUpperCase() === ch;

const filterKey = keys => key => keys.indexOf(key) === -1;

const omit = (obj, keys) => {
  const res = {};
  Object.keys(obj).filter(filterKey(keys)).forEach(key => {
    res[key] = obj[key];
  });
  return res;
};

function filterProps(component, props, omitKeys) {
  const filteredProps = omit(props, omitKeys); // Check if it's an HTML tag and not a custom element

  if (typeof component === 'string' && component.indexOf('-') === -1 && !isCapital(component[0])) {
    Object.keys(filteredProps).forEach(key => {
      if (!index(key)) {
        // Don't pass through invalid attributes to HTML elements
        delete filteredProps[key];
      }
    });
  }

  return filteredProps;
}

const warnIfInvalid = (value, componentName) => {
};

function styled(tag) {
  return options => {

    const render = (props, ref) => {
      const {
        as: component = tag,
        class: className
      } = props;
      const filteredProps = filterProps(component, props, ['as', 'class']);
      filteredProps.ref = ref;
      filteredProps.className = options.atomic ? cx$1(options.class, filteredProps.className || className) : cx$1(filteredProps.className || className, options.class);
      const {
        vars
      } = options;

      if (vars) {
        const style = {}; // eslint-disable-next-line guard-for-in,no-restricted-syntax

        for (const name in vars) {
          const variable = vars[name];
          const result = variable[0];
          const unit = variable[1] || '';
          const value = typeof result === 'function' ? result(props) : result;
          warnIfInvalid(value, options.name);
          style[`--${name}`] = `${value}${unit}`;
        }

        const ownStyle = filteredProps.style || {};
        const keys = Object.keys(ownStyle);

        if (keys.length > 0) {
          keys.forEach(key => {
            style[key] = ownStyle[key];
          });
        }

        filteredProps.style = style;
      }

      if (tag.__linaria && tag !== component) {
        // If the underlying tag is a styled component, forward the `as` prop
        // Otherwise the styles from the underlying component will be ignored
        filteredProps.as = component;
        return /*#__PURE__*/React.createElement(tag, filteredProps);
      }

      return /*#__PURE__*/React.createElement(component, filteredProps);
    };

    const Result = React.forwardRef ? /*#__PURE__*/React.forwardRef(render) : // React.forwardRef won't available on older React versions and in Preact
    // Fallback to a innerRef prop in that case
    props => {
      const rest = omit(props, ['innerRef']);
      return render(rest, props.innerRef);
    };
    Result.displayName = options.name; // These properties will be read by the babel plugin for interpolation

    Result.__linaria = {
      className: options.class,
      extends: tag
    };
    return Result;
  };
}

var styled$1 = styled;

var layoutStyles_z62jah = '';

const Container$m = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c16eavkt"
});
const Content = /*#__PURE__*/styled$1("div")({
  name: "Content",
  class: "c1d8et0l"
});
const HeaderContainer = /*#__PURE__*/styled$1("div")({
  name: "HeaderContainer",
  class: "h7nzin8"
});
const FooterContainer = /*#__PURE__*/styled$1("div")({
  name: "FooterContainer",
  class: "f1383p9j"
});

const Layout = observer(({
  contentSlot,
  headerSlot,
  footerSlot
}) => {
  const {
    currentRoute
  } = useCurrentRoute();
  const isHeaderVisible = (currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.withHeader) || (currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.header);
  return /*#__PURE__*/e(Container$m, {
    children: [isHeaderVisible && /*#__PURE__*/e(HeaderContainer, {
      children: headerSlot
    }), /*#__PURE__*/e(Content, {
      children: contentSlot
    }), (currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.withNavigation) && /*#__PURE__*/e(FooterContainer, {
      children: footerSlot
    })]
  });
});

function Swap(props) {
  if (props.is) return /*#__PURE__*/e(d$1, {
    children: props.isSlot
  });
  return /*#__PURE__*/e(d$1, {
    children: props.children
  });
}

var notFoundPageStyles_5sacaj = '';

const Container$l = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cnb1u91"
});

addBlock({
  data: {
    notFound: {
      title: ['Seems nothing found here', 'Похоже ничего не нашлось']
    }
  }
});

function NotFoundPage() {
  return /*#__PURE__*/e(Container$l, {
    children: t('notFound.title')
  });
}

const ScreensSwitch = observer(() => {
  const {
    currentRoute
  } = useCurrentRoute();
  const ScreenComponent = currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.component;
  const isPageExist = currentRoute && ScreenComponent;
  return /*#__PURE__*/e(d$1, {
    children: /*#__PURE__*/e(Swap, {
      is: !isPageExist,
      isSlot: /*#__PURE__*/e(NotFoundPage, {}),
      children: /*#__PURE__*/e(Swap, {
        is: !(currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.route.path),
        isSlot: /*#__PURE__*/e(NotFoundPage, {}),
        children: ScreenComponent && /*#__PURE__*/e(ScreenComponent, {})
      })
    })
  });
});

var separatorStyles_rka3su = '';

const Separator = /*#__PURE__*/styled$1("div")({
  name: "Separator",
  class: "sp7x0af"
});

var headerStyles_1e87tu0 = '';

const Container$k = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c15fl877"
});
const Title$3 = /*#__PURE__*/styled$1("div")({
  name: "Title",
  class: "th8cads"
});
const SlotContainer = /*#__PURE__*/styled$1("div")({
  name: "SlotContainer",
  class: "s1kdx1r"
});

const Header$1 = observer(() => {
  var ref, ref1;
  const {
    currentRoute
  } = useCurrentRoute();
  const title = (currentRoute === null || currentRoute === void 0 ? void 0 : (ref = currentRoute.header) === null || ref === void 0 ? void 0 : ref.title()) || '';
  const Component = currentRoute === null || currentRoute === void 0 ? void 0 : (ref1 = currentRoute.header) === null || ref1 === void 0 ? void 0 : ref1.component;
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(Container$k, {
      children: [/*#__PURE__*/e(Title$3, {
        children: title
      }), Component && /*#__PURE__*/e(SlotContainer, {
        children: /*#__PURE__*/e(Component, {})
      })]
    }), /*#__PURE__*/e(Separator, {})]
  });
});

const Routes = {
  expense: '/',
  expenseItem: '/expense',
  analytic: '/analytic',
  categories: '/categories',
  settings: '/settings',
  empty: '/empty'
};

var navigationStyles_88bkgm = '';

const Container$j = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cxkvvxg"
});

var iconStyles_1jwujit = '';

const IconWrapper$3 = /*#__PURE__*/styled$1("span")({
  name: "IconWrapper",
  class: "iavps5w",
  vars: {
    "iavps5w-0": [props => {
      switch (props.size) {
        case 'small':
          return '10px';

        case 'big':
          return '18px';

        case 'huge':
          return '28px';

        default:
        case 'normal':
          return '14px';
      }
    }]
  }
});

var icons = '';

function Icon({
  iconName,
  iconSize = 'normal'
}) {
  return /*#__PURE__*/e(IconWrapper$3, {
    className: `x-icon-${iconName}`,
    size: iconSize
  });
}

var naviItemStyles_6dv4h9 = '';

const Container$i = /*#__PURE__*/styled$1("button")({
  name: "Container",
  class: "c3m6fju",
  vars: {
    "c3m6fju-0": [props => props.isMatched ? 1 : 'var(--opacity-disabled)']
  }
});
const Title$2 = /*#__PURE__*/styled$1("div")({
  name: "Title",
  class: "t7gt6rq"
});

var __decorate$C = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$o = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$o = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let HistoryService = class HistoryService {
  push(route) {
    const history = this.routerHistory.history;
    if (!history) return;
    history(route);
  }

  replace(route) {
    const history = this.routerHistory.history;
    if (!history) return;
    history(route, {
      replace: true
    });
  }

  constructor(routerHistory) {
    this.routerHistory = routerHistory;
  }

};
HistoryService = __decorate$C([Service(), __param$o(0, Inject()), __metadata$o("design:type", Function), __metadata$o("design:paramtypes", [typeof RouterHistory === "undefined" ? Object : RouterHistory])], HistoryService);

var __decorate$B = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$n = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$n = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let NavigationAction = class NavigationAction {
  handleChangePage(nextPage) {
    this.historyService.push(nextPage);
  }

  constructor(historyService) {
    this.historyService = historyService;
  }

};
NavigationAction = __decorate$B([Action(), __param$n(0, Inject()), __metadata$n("design:type", Function), __metadata$n("design:paramtypes", [typeof HistoryService === "undefined" ? Object : HistoryService])], NavigationAction);

var dist = {};

var maybe = {};

Object.defineProperty(maybe, "__esModule", { value: true });
maybe.Nothing = maybe.Just = maybe.Maybe = void 0;
/**
 * Container for missing values information when working with `Maybe.match2` or
 * higher order analogs.
 */
class MissingValues {
    constructor(positions) {
        this.POSITIONS_NAMES = ["first", "second", "third", "fourth", "fifth"];
        this.positions = positions;
    }
    /**
     * Returns position at which values are missing, starting from 0.
     */
    getPositions() {
        return this.positions;
    }
    /**
     * Returns human readable message describing which values are missing.
     * If `names` list is passed, values from this list will be matched to
     * corresponding positions from missing values. Otherwise human readable form
     * will be put in place.
     *
     * Should serve to improve readability of error messages.
     *
     * Example:
     * ```
     * const missing = new MissingValues([0, 2])
     * missing.getPositions() // [0, 2]
     * missing.getMessage() // "first and third values are missing"
     * missing.getMessage(['a', 'b']) // "a and b values are missing"
     * missing.getMessage(['a']) // "a and second values are missing"
     * ```
     *
     * @param names list of value names
     */
    getMessage(names) {
        return this.composeMissingValuesMessage(this.positions, names || []);
    }
    composeMissingValuesMessage(positions, names) {
        if (positions.length === 0) {
            return "some values are missing";
        }
        if (positions.length === 1) {
            const value = this.mapPositionToHumanReadable(positions[0], names);
            return `${value} value is missing`;
        }
        const values = positions
            .map((i) => this.mapPositionToHumanReadable(i, names))
            .join(" and ");
        return `${values} values are missing`;
    }
    mapPositionToHumanReadable(position, names) {
        return (names[position] || this.POSITIONS_NAMES[position] || "<unspecified value>");
    }
}
/**
 * The `Maybe` monad represents computations which might "go wrong" by not returning a value.
 */
class Maybe {
    /**
     * Evaluates `Maybe` object and runs corresponding match function.
     *
     * Example:
     * ```
     * function numberToString(maybeNumber: Maybe<number>): string {
     *   return maybeNumber.match({
     *     Just: value => `${value}`,
     *     Nothing: () => 'invalid number',
     *   })
     * }
     *
     * numberToString(Just(5)) // "5"
     * numberToString(Nothing()) // "invalid number"
     * ```
     *
     * @param match an object with handler functions
     */
    match(match) {
        if (this.isValue()) {
            return match.Just(this.value);
        }
        return match.Nothing();
    }
    /**
     * Returns value if it's `Just(value)`.
     *
     * Returns `defaultValue` if it's `Nothing()`.
     *
     * @param defaultValue default value to be returned
     */
    withDefault(defaultValue) {
        if (this.isValue()) {
            return this.value;
        }
        return defaultValue;
    }
    /**
     * Returns `true` if it's `Just(value)`.
     */
    isValue() {
        return this.value !== null && this.value !== undefined;
    }
    /**
     * Returns `true` if it's `Nothing()`.
     */
    isNothing() {
        return !this.isValue();
    }
    /**
     * Compares to Maybe object containing value of the same type.
     *
     * @param other value to compare to
     */
    isEqualTo(other) {
        if (this.isNothing() && other.isNothing()) {
            return true;
        }
        if (this.isValue() && other.isValue()) {
            return this.value === other.value;
        }
        return false;
    }
    /**
     * *Note*: the usage of this function is discouraged. Instead, prefer to use
     * `match` and handle the `Nothing` case expicitly or use `withDefault()`.
     *
     * Returns value if `Maybe` is `Just(value)`, throws otherwise.
     */
    getValue() {
        if (this.isNothing()) {
            throw new Error("tried to unwrap Just(value) but got Nothing");
        }
        return this.value;
    }
    /**
     * Returns new `Maybe` object with modified value if
     * it is Just(value). Returns `Nothing` otherwise.
     *
     * @param mapper mapper function
     */
    map(mapper) {
        if (this.isValue()) {
            return Maybe.Just(mapper(this.value));
        }
        return Maybe.Nothing();
    }
    /**
     * Runs `fun` with value if it's Just(value).
     * Will not run `fun` if it's Nothing().
     * Returns self.
     *
     * @param mapper tap function
     */
    tap(fun) {
        if (this.isValue()) {
            fun(this.value);
        }
        return this;
    }
    /**
     * Wraps value in `Maybe` (value) object.
     *
     * @param value value to wrap
     */
    static Just(value) {
        const result = new Maybe();
        result.value = value;
        return result;
    }
    /**
     * Wraps value in `Maybe` (nothing) object.
     *
     * @param value value to wrap
     */
    static Nothing() {
        return new Maybe();
    }
    /**
     * Creates `Maybe` object from value.
     *
     * If `value` is `null` or `undefined`, will create `Nothing()`.
     * Otherwise will generate `Just(value)`.
     *
     * Example:
     * ```
     * Maybe.from(5)      // Just(5)
     * Maybe.from('test') // Just('test')
     * Maybe.from(null)   // Nothing()
     * ```
     *
     * @param value value to create `Maybe` from
     */
    static from(value) {
        if (value === null || value === undefined) {
            return Maybe.Nothing();
        }
        return Maybe.Just(value);
    }
    /**
     * Combines two `Maybe` objects in a single match, ensuring that all
     * given values are present.
     *
     * Example:
     * ```
     * function combine(x1: Maybe<number>, x2: Maybe<string>): string {
     *   return Maybe.match2(x1, x2, {
     *     Values: (num, str) => `x1=${num} x2=${str}`,
     *     Missing: missing => `error: ${missing.getMessage(['x1', 'x2'])}`,
     *   })
     * }
     *
     * combine(Just(123), Just('test')) // "x1=123 x2=test"
     * combine(Just(123), Nothing()) // "error: x2 value is missing"
     * combine(Nothing(), Nothing()) // "error: x1 and x2 values are missing"
     * ```
     *
     * @param {Maybe} m1 first value
     * @param {Maybe} m2 second value
     * @param {Object} match object with match functions
     */
    static match2(m1, m2, match) {
        if (m1.isValue() && m2.isValue()) {
            return match.Values(m1.value, m2.value);
        }
        const indices = getMissingValuesIndices([m1, m2]);
        return match.Missing(new MissingValues(indices));
    }
    /**
     * Same as `match2` but accepts 3 values.
     *
     * @param {Maybe} m1 first value
     * @param {Maybe} m2 second value
     * @param {Maybe} m3 third value
     * @param {Object} match object with match functions
     */
    static match3(m1, m2, m3, match) {
        if (m1.isValue() && m2.isValue() && m3.isValue()) {
            return match.Values(m1.value, m2.value, m3.value);
        }
        const indices = getMissingValuesIndices([m1, m2, m3]);
        return match.Missing(new MissingValues(indices));
    }
    /**
     * Same as `match2` but accepts 4 values.
     *
     * @param {Maybe} m1 first value
     * @param {Maybe} m2 second value
     * @param {Maybe} m3 third value
     * @param {Maybe} m4 fourth value
     * @param {Object} match object with match functions
     */
    static match4(m1, m2, m3, m4, match) {
        if (m1.isValue() && m2.isValue() && m3.isValue() && m4.isValue()) {
            return match.Values(m1.value, m2.value, m3.value, m4.value);
        }
        const indices = getMissingValuesIndices([m1, m2, m3, m4]);
        return match.Missing(new MissingValues(indices));
    }
    /**
     * Same as `match5` but accepts 5 values.
     *
     * @param {Maybe} m1 first value
     * @param {Maybe} m2 second value
     * @param {Maybe} m3 third value
     * @param {Maybe} m4 fourth value
     * @param {Maybe} m5 fifth value
     * @param {Object} match object with match functions
     */
    static match5(m1, m2, m3, m4, m5, match) {
        if (m1.isValue() &&
            m2.isValue() &&
            m3.isValue() &&
            m4.isValue() &&
            m5.isValue()) {
            return match.Values(m1.value, m2.value, m3.value, m4.value, m5.value);
        }
        const indices = getMissingValuesIndices([m1, m2, m3, m4, m5]);
        return match.Missing(new MissingValues(indices));
    }
}
maybe.Maybe = Maybe;
maybe.Just = Maybe.Just;
maybe.Nothing = Maybe.Nothing;
function getMissingValuesIndices(items) {
    const indices = [];
    items.forEach((item, index) => item.isNothing() && indices.push(index));
    return indices;
}

var result = {};

Object.defineProperty(result, "__esModule", { value: true });
result.Err = result.Ok = result.Result = void 0;
const maybe_1$1 = maybe;
/**
 * Result<V, E> is a type used for returning and propagating errors.
 * It has two possible states:
 * - Ok(V), representing success and containing a value;
 * - Err(E), representing error and containing an error value.
 */
class Result {
    /**
     * Evaluates `Result` and runs:
     * - "Ok" handler if result is `Ok(value)`
     * - "Err" handler if result is `Err(error)`
     *
     * @param match object with handler functions
     */
    match(match) {
        if (this.isOk()) {
            return match.Ok(this.value);
        }
        return match.Err(this.error);
    }
    /**
     * *Note*: the usage of this function is discouraged. Instead, prefer to use
     * `match` and handle the `Err` case expicitly or use `getValueOr()`.
     *
     * Returns value if `Result` is `Ok(value)`, throws otherwise.
     */
    getValue() {
        if (!this.isOk()) {
            throw new Error("tried to unwrap result value but result is not Ok");
        }
        return this.value;
    }
    /**
     * Returns value if `Result` is `Ok(value)`, otherwise returns `defaultValue`.
     *
     * @param defaultValue default value
     */
    getValueOr(defaultValue) {
        if (!this.isOk()) {
            return defaultValue;
        }
        return this.value;
    }
    /**
     * *Note*: the usage of this function is discouraged. Instead, prefer to use
     * `match` or use `getErrorOr()`.
     *
     * Returns error value if `Result` is `Err(error)`, throws otherwise.
     */
    getError() {
        if (!this.isErr()) {
            throw new Error("tried to unwrap result error but result is not Err");
        }
        return this.error;
    }
    /**
     * Returns error if `Result` is `Err(error)`, otherwise returns `defaultError`.
     *
     * @param defaultError default error
     */
    getErrorOr(defaultError) {
        if (!this.isErr()) {
            return defaultError;
        }
        return this.error;
    }
    /**
     * Returns Just(value) if result is Ok(value).
     * Returns Nothing() if result is Err(error).
     */
    ok() {
        if (this.isOk()) {
            return maybe_1$1.Just(this.value);
        }
        return maybe_1$1.Nothing();
    }
    /**
     * Returns Just(error) if result is Err(error).
     * Returns Nothing() if result is Ok(value).
     */
    err() {
        if (this.isErr()) {
            return maybe_1$1.Just(this.error);
        }
        return maybe_1$1.Nothing();
    }
    /**
     * Returns true if result is a value.
     */
    isOk() {
        return this.value !== undefined;
    }
    /**
     * Returns true if result is an error.
     */
    isErr() {
        return !this.isOk();
    }
    /**
     * Checks if self is equal to given result.
     *
     * @param other result to compare self to
     */
    isEqualTo(other) {
        if (this.isErr() && other.isErr()) {
            return this.error === other.error;
        }
        if (this.isOk() && other.isOk()) {
            return this.value === other.value;
        }
        return false;
    }
    /**
     * Maps self to new `Result` keeping `error` value.
     *
     * @param mapper mapper function
     */
    map(mapper) {
        if (this.isOk()) {
            return Result.Ok(mapper(this.value));
        }
        return Result.Err(this.error);
    }
    /**
     * Maps self to new `Result` keeping `value` and modifying `error`.
     *
     * @param mapper mapper function
     */
    mapErr(mapper) {
        if (this.isErr()) {
            return Result.Err(mapper(this.error));
        }
        return Result.Ok(this.value);
    }
    /**
     * Returns argument if self is `Ok(value)`. Otherwise returns `Err(error)`.
     *
     * @param result value to return
     */
    and(result) {
        if (this.isOk()) {
            return result;
        }
        return Result.Err(this.error);
    }
    /**
     * Runs predicate function if self is `Ok(value)`, otherwise returns `Err(error)`.
     *
     * @param op function to run
     */
    andThen(op) {
        if (this.isOk()) {
            return op(this.value);
        }
        return Result.Err(this.error);
    }
    /**
     * Constructs `Ok(value)` instance of `Result`.
     *
     * @param value value to wrap
     */
    static Ok(value) {
        const result = new Result();
        result.value = value;
        return result;
    }
    /**
     * Constructs `Err(error)` instance of `Result`.
     *
     * @param error error value
     */
    static Err(error) {
        const result = new Result();
        result.error = error;
        return result;
    }
}
result.Result = Result;
result.Ok = Result.Ok;
result.Err = Result.Err;

var error = {};

Object.defineProperty(error, "__esModule", { value: true });
error.Error = void 0;
const maybe_1 = maybe;
class Error$1 {
    constructor(message) {
        this.message = message;
        this.nestedError = maybe_1.Nothing();
    }
    static new(value) {
        return new Error$1(value.toString());
    }
    static flatten(error) {
        const thisError = new Error$1(error.getMessage());
        const rest = error.getNestedError().match({
            Just: (err) => Error$1.flatten(err),
            Nothing: () => [],
        });
        return [thisError, ...rest];
    }
    text() {
        const errors = Error$1.flatten(this);
        const messages = errors.map((err) => err.getMessage());
        return messages.join(": ");
    }
    wrap(error) {
        this.nestedError = maybe_1.Just(error);
        return this;
    }
    getNestedError() {
        return this.nestedError;
    }
    getMessage() {
        return this.message;
    }
    toString() {
        return this.message;
    }
}
error.Error = Error$1;

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.Err = exports.Ok = exports.Result = exports.Nothing = exports.Just = exports.Maybe = void 0;
var maybe_1 = maybe;
Object.defineProperty(exports, "Maybe", { enumerable: true, get: function () { return maybe_1.Maybe; } });
Object.defineProperty(exports, "Just", { enumerable: true, get: function () { return maybe_1.Just; } });
Object.defineProperty(exports, "Nothing", { enumerable: true, get: function () { return maybe_1.Nothing; } });
var result_1 = result;
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return result_1.Result; } });
Object.defineProperty(exports, "Ok", { enumerable: true, get: function () { return result_1.Ok; } });
Object.defineProperty(exports, "Err", { enumerable: true, get: function () { return result_1.Err; } });
var error_1 = error;
Object.defineProperty(exports, "Error", { enumerable: true, get: function () { return error_1.Error; } });
}(dist));

function createErrorClass(message) {
  return class ErrorClass {
    constructor(error) {
      this.stack = new Error().stack;
      this.message = message;
      this.error = error;
    }

  };
}

var AppErrors;

(function (AppErrors) {
  AppErrors.DefineCategoryResponse = createErrorClass('Failed define categories');
  AppErrors.UnexpectedErrorDefineCategory = createErrorClass('Unexpected add category');
})(AppErrors || (AppErrors = {}));

/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 3.2.2, Wed Apr 27 2022
 *
 * https://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var _global = typeof globalThis !== 'undefined' ? globalThis :
    typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            global;

var keys = Object.keys;
var isArray = Array.isArray;
if (typeof Promise !== 'undefined' && !_global.Promise) {
    _global.Promise = Promise;
}
function extend(obj, extension) {
    if (typeof extension !== 'object')
        return obj;
    keys(extension).forEach(function (key) {
        obj[key] = extension[key];
    });
    return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
    if (typeof extension === 'function')
        extension = extension(getProto(proto));
    (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function (key) {
        setProp(proto, key, extension[key]);
    });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
        { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
        { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
    return {
        from: function (Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
                extend: props.bind(null, Child.prototype)
            };
        }
    };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
    var pd = getOwnPropertyDescriptor(obj, prop);
    var proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
    return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
}
function assert(b) {
    if (!b)
        throw new Error("Assertion Failed");
}
function asap$1(fn) {
    if (_global.setImmediate)
        setImmediate(fn);
    else
        setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
    return array.reduce(function (result, item, i) {
        var nameAndValue = extractor(item, i);
        if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
        return result;
    }, {});
}
function tryCatch(fn, onerror, args) {
    try {
        fn.apply(null, args);
    }
    catch (ex) {
        onerror && onerror(ex);
    }
}
function getByKeyPath(obj, keyPath) {
    if (hasOwn(obj, keyPath))
        return obj[keyPath];
    if (!keyPath)
        return obj;
    if (typeof keyPath !== 'string') {
        var rv = [];
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
        }
        return rv;
    }
    var period = keyPath.indexOf('.');
    if (period !== -1) {
        var innerObj = obj[keyPath.substr(0, period)];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return undefined;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === undefined)
        return;
    if ('isFrozen' in Object && Object.isFrozen(obj))
        return;
    if (typeof keyPath !== 'string' && 'length' in keyPath) {
        assert(typeof value !== 'string' && 'length' in value);
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
        }
    }
    else {
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                        obj.splice(currentKeyPath, 1);
                    else
                        delete obj[currentKeyPath];
                }
                else
                    obj[currentKeyPath] = value;
            else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj || !hasOwn(obj, currentKeyPath))
                    innerObj = (obj[currentKeyPath] = {});
                setByKeyPath(innerObj, remainingKeyPath, value);
            }
        }
        else {
            if (value === undefined) {
                if (isArray(obj) && !isNaN(parseInt(keyPath)))
                    obj.splice(keyPath, 1);
                else
                    delete obj[keyPath];
            }
            else
                obj[keyPath] = value;
        }
    }
}
function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string')
        setByKeyPath(obj, keyPath, undefined);
    else if ('length' in keyPath)
        [].map.call(keyPath, function (kp) {
            setByKeyPath(obj, kp, undefined);
        });
}
function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
        if (hasOwn(obj, m))
            rv[m] = obj[m];
    }
    return rv;
}
var concat = [].concat;
function flatten(a) {
    return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
    .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; });
var intrinsicTypes = intrinsicTypeNames.map(function (t) { return _global[t]; });
arrayToObject(intrinsicTypeNames, function (x) { return [x, true]; });
var circularRefs = null;
function deepClone(any) {
    circularRefs = typeof WeakMap !== 'undefined' && new WeakMap();
    var rv = innerDeepClone(any);
    circularRefs = null;
    return rv;
}
function innerDeepClone(any) {
    if (!any || typeof any !== 'object')
        return any;
    var rv = circularRefs && circularRefs.get(any);
    if (rv)
        return rv;
    if (isArray(any)) {
        rv = [];
        circularRefs && circularRefs.set(any, rv);
        for (var i = 0, l = any.length; i < l; ++i) {
            rv.push(innerDeepClone(any[i]));
        }
    }
    else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
        rv = any;
    }
    else {
        var proto = getProto(any);
        rv = proto === Object.prototype ? {} : Object.create(proto);
        circularRefs && circularRefs.set(any, rv);
        for (var prop in any) {
            if (hasOwn(any, prop)) {
                rv[prop] = innerDeepClone(any[prop]);
            }
        }
    }
    return rv;
}
var toString = {}.toString;
function toStringTag(o) {
    return toString.call(o).slice(8, -1);
}
var iteratorSymbol = typeof Symbol !== 'undefined' ?
    Symbol.iterator :
    '@@iterator';
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function (x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () { return null; };
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
        if (isArray(arrayLike))
            return arrayLike.slice();
        if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
            return [arrayLike];
        if ((it = getIteratorOf(arrayLike))) {
            a = [];
            while ((x = it.next()), !x.done)
                a.push(x.value);
            return a;
        }
        if (arrayLike == null)
            return [arrayLike];
        i = arrayLike.length;
        if (typeof i === 'number') {
            a = new Array(i);
            while (i--)
                a[i] = arrayLike[i];
            return a;
        }
        return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
        a[i] = arguments[i];
    return a;
}
var isAsyncFunction = typeof Symbol !== 'undefined'
    ? function (fn) { return fn[Symbol.toStringTag] === 'AsyncFunction'; }
    : function () { return false; };

var debug = typeof location !== 'undefined' &&
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
}
var libraryFilter = function () { return true; };
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
        try {
            getErrorWithStack.arguments;
            throw new Error();
        }
        catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
        return "";
    numIgnoredFrames = (numIgnoredFrames || 0);
    if (stack.indexOf(exception.name) === 0)
        numIgnoredFrames += (exception.name + exception.message).split('\n').length;
    return stack.split('\n')
        .slice(numIgnoredFrames)
        .filter(libraryFilter)
        .map(function (frame) { return "\n" + frame; })
        .join('');
}

var dexieErrorNames = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait'
];
var idbDomErrorNames = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone'
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed",
    MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg;
}
derive(DexieError).from(Error).extend({
    stack: {
        get: function () {
            return this._stack ||
                (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
        }
    },
    toString: function () { return this.name + ": " + this.message; }
});
function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + Object.keys(failures)
        .map(function (key) { return failures[key].toString(); })
        .filter(function (v, i, s) { return s.indexOf(v) === i; })
        .join('\n');
}
function ModifyError(msg, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = Object.keys(failures).map(function (pos) { return failures[pos]; });
    this.failuresByPos = failures;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
var BaseException = DexieError;
var exceptions = errorList.reduce(function (obj, name) {
    var fullName = name + "Error";
    function DexieError(msgOrInner, inner) {
        this._e = getErrorWithStack();
        this.name = fullName;
        if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
        }
        else if (typeof msgOrInner === 'string') {
            this.message = "" + msgOrInner + (!inner ? '' : '\n ' + inner);
            this.inner = inner || null;
        }
        else if (typeof msgOrInner === 'object') {
            this.message = msgOrInner.name + " " + msgOrInner.message;
            this.inner = msgOrInner;
        }
    }
    derive(DexieError).from(BaseException);
    obj[name] = DexieError;
    return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
    obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
        return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
        setProp(rv, "stack", { get: function () {
                return this.inner.stack;
            } });
    }
    return rv;
}
var fullNameExceptions = errorList.reduce(function (obj, name) {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
        obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() { }
function mirror(val) { return val; }
function pureFunctionChain(f1, f2) {
    if (f1 == null || f1 === mirror)
        return f2;
    return function (val) {
        return f2(f1(val));
    };
}
function callBoth(on1, on2) {
    return function () {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
function hookCreatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res !== undefined)
            arguments[0] = res;
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res2 !== undefined ? res2 : res;
    };
}
function hookDeletingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        f1.apply(this, arguments);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = this.onerror = null;
        f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
}
function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function (modifications) {
        var res = f1.apply(this, arguments);
        extend(modifications, res);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res === undefined ?
            (res2 === undefined ? undefined : res2) :
            (extend(res, res2));
    };
}
function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        if (f2.apply(this, arguments) === false)
            return false;
        return f1.apply(this, arguments);
    };
}
function promisableChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res && typeof res.then === 'function') {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
                args[i] = arguments[i];
            return res.then(function () {
                return f2.apply(thiz, args);
            });
        }
        return f2.apply(this, arguments);
    };
}

var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100,
MAX_LONG_STACKS = 20, ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === 'undefined' ?
    [] :
    (function () {
        var globalP = Promise.resolve();
        if (typeof crypto === 'undefined' || !crypto.subtle)
            return [globalP, getProto(globalP), globalP];
        var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [
            nativeP,
            getProto(nativeP),
            globalP
        ];
    })(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ?
    function () { resolvedGlobalPromise.then(physicalTick); }
    :
        _global.setImmediate ?
            setImmediate.bind(null, physicalTick) :
            _global.MutationObserver ?
                function () {
                    var hiddenDiv = document.createElement("div");
                    (new MutationObserver(function () {
                        physicalTick();
                        hiddenDiv = null;
                    })).observe(hiddenDiv, { attributes: true });
                    hiddenDiv.setAttribute('i', '1');
                } :
                function () { setTimeout(physicalTick, 0); };
var asap = function (callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
        schedulePhysicalTick();
        needsNewPhysicalTick = false;
    }
};
var isOutsideMicroTick = true,
needsNewPhysicalTick = true,
unhandledErrors = [],
rejectingErrors = [],
currentFulfiller = null, rejectionMapper = mirror;
var globalPSD = {
    id: 'global',
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function () {
        this.unhandleds.forEach(function (uh) {
            try {
                globalError(uh[0], uh[1]);
            }
            catch (e) { }
        });
    }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
    if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
    this._listeners = [];
    this.onuncatched = nop;
    this._lib = false;
    var psd = (this._PSD = PSD);
    if (debug) {
        this._stackHolder = getErrorWithStack();
        this._prev = null;
        this._numPrev = 0;
    }
    if (typeof fn !== 'function') {
        if (fn !== INTERNAL)
            throw new TypeError('Not a function');
        this._state = arguments[1];
        this._value = arguments[2];
        if (this._state === false)
            handleRejection(this, this._value);
        return;
    }
    this._state = null;
    this._value = null;
    ++psd.ref;
    executePromiseTask(this, fn);
}
var thenProp = {
    get: function () {
        var psd = PSD, microTaskId = totalEchoes;
        function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            var cleanup = possibleAwait && !decrementExpectedAwaits();
            var rv = new DexiePromise(function (resolve, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
            });
            debug && linkToPreviousPromise(rv, this);
            return rv;
        }
        then.prototype = INTERNAL;
        return then;
    },
    set: function (value) {
        setProp(this, 'then', value && value.prototype === INTERNAL ?
            thenProp :
            {
                get: function () {
                    return value;
                },
                set: thenProp.set
            });
    }
};
props(DexiePromise.prototype, {
    then: thenProp,
    _then: function (onFulfilled, onRejected) {
        propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function (onRejected) {
        if (arguments.length === 1)
            return this.then(null, onRejected);
        var type = arguments[0], handler = arguments[1];
        return typeof type === 'function' ? this.then(null, function (err) {
            return err instanceof type ? handler(err) : PromiseReject(err);
        })
            : this.then(null, function (err) {
                return err && err.name === type ? handler(err) : PromiseReject(err);
            });
    },
    finally: function (onFinally) {
        return this.then(function (value) {
            onFinally();
            return value;
        }, function (err) {
            onFinally();
            return PromiseReject(err);
        });
    },
    stack: {
        get: function () {
            if (this._stack)
                return this._stack;
            try {
                stack_being_generated = true;
                var stacks = getStack(this, [], MAX_LONG_STACKS);
                var stack = stacks.join("\nFrom previous: ");
                if (this._state !== null)
                    this._stack = stack;
                return stack;
            }
            finally {
                stack_being_generated = false;
            }
        }
    },
    timeout: function (ms, msg) {
        var _this = this;
        return ms < Infinity ?
            new DexiePromise(function (resolve, reject) {
                var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
    }
});
if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
}
props(DexiePromise, {
    all: function () {
        var values = getArrayOf.apply(null, arguments)
            .map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            if (values.length === 0)
                resolve([]);
            var remaining = values.length;
            values.forEach(function (a, i) { return DexiePromise.resolve(a).then(function (x) {
                values[i] = x;
                if (!--remaining)
                    resolve(values);
            }, reject); });
        });
    },
    resolve: function (value) {
        if (value instanceof DexiePromise)
            return value;
        if (value && typeof value.then === 'function')
            return new DexiePromise(function (resolve, reject) {
                value.then(resolve, reject);
            });
        var rv = new DexiePromise(INTERNAL, true, value);
        linkToPreviousPromise(rv, currentFulfiller);
        return rv;
    },
    reject: PromiseReject,
    race: function () {
        var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            values.map(function (value) { return DexiePromise.resolve(value).then(resolve, reject); });
        });
    },
    PSD: {
        get: function () { return PSD; },
        set: function (value) { return PSD = value; }
    },
    totalEchoes: { get: function () { return totalEchoes; } },
    newPSD: newScope,
    usePSD: usePSD,
    scheduler: {
        get: function () { return asap; },
        set: function (value) { asap = value; }
    },
    rejectionMapper: {
        get: function () { return rejectionMapper; },
        set: function (value) { rejectionMapper = value; }
    },
    follow: function (fn, zoneProps) {
        return new DexiePromise(function (resolve, reject) {
            return newScope(function (resolve, reject) {
                var psd = PSD;
                psd.unhandleds = [];
                psd.onunhandled = reject;
                psd.finalize = callBoth(function () {
                    var _this = this;
                    run_at_end_of_this_or_next_physical_tick(function () {
                        _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                    });
                }, psd.finalize);
                fn();
            }, zoneProps, resolve, reject);
        });
    }
});
if (NativePromise) {
    if (NativePromise.allSettled)
        setProp(DexiePromise, "allSettled", function () {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve) {
                if (possiblePromises.length === 0)
                    resolve([]);
                var remaining = possiblePromises.length;
                var results = new Array(remaining);
                possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return results[i] = { status: "fulfilled", value: value }; }, function (reason) { return results[i] = { status: "rejected", reason: reason }; })
                    .then(function () { return --remaining || resolve(results); }); });
            });
        });
    if (NativePromise.any && typeof AggregateError !== 'undefined')
        setProp(DexiePromise, "any", function () {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                if (possiblePromises.length === 0)
                    reject(new AggregateError([]));
                var remaining = possiblePromises.length;
                var failures = new Array(remaining);
                possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return resolve(value); }, function (failure) {
                    failures[i] = failure;
                    if (!--remaining)
                        reject(new AggregateError(failures));
                }); });
            });
        });
}
function executePromiseTask(promise, fn) {
    try {
        fn(function (value) {
            if (promise._state !== null)
                return;
            if (value === promise)
                throw new TypeError('A promise cannot be resolved with itself.');
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === 'function') {
                executePromiseTask(promise, function (resolve, reject) {
                    value instanceof DexiePromise ?
                        value._then(resolve, reject) :
                        value.then(resolve, reject);
                });
            }
            else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
                endMicroTickScope();
        }, handleRejection.bind(null, promise));
    }
    catch (ex) {
        handleRejection(promise, ex);
    }
}
function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
        return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
        var origProp = getPropertyDescriptor(reason, "stack");
        reason._promise = promise;
        setProp(reason, "stack", {
            get: function () {
                return stack_being_generated ?
                    origProp && (origProp.get ?
                        origProp.get.apply(reason) :
                        origProp.value) :
                    promise.stack;
            }
        });
    });
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
        endMicroTickScope();
}
function propagateAllListeners(promise) {
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
        propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize();
    if (numScheduledCalls === 0) {
        ++numScheduledCalls;
        asap(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
}
function propagateToListener(promise, listener) {
    if (promise._state === null) {
        promise._listeners.push(listener);
        return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
        return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
    try {
        currentFulfiller = promise;
        var ret, value = promise._value;
        if (promise._state) {
            ret = cb(value);
        }
        else {
            if (rejectingErrors.length)
                rejectingErrors = [];
            ret = cb(value);
            if (rejectingErrors.indexOf(value) === -1)
                markErrorAsHandled(promise);
        }
        listener.resolve(ret);
    }
    catch (e) {
        listener.reject(e);
    }
    finally {
        currentFulfiller = null;
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        --listener.psd.ref || listener.psd.finalize();
    }
}
function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
        return stacks;
    var stack = "";
    if (promise._state === false) {
        var failure = promise._value, errorName, message;
        if (failure != null) {
            errorName = failure.name || "Error";
            message = failure.message || failure;
            stack = prettyStack(failure, 0);
        }
        else {
            errorName = failure;
            message = "";
        }
        stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
        stack = prettyStack(promise._stackHolder, 2);
        if (stack && stacks.indexOf(stack) === -1)
            stacks.push(stack);
        if (promise._prev)
            getStack(promise._prev, stacks, limit);
    }
    return stacks;
}
function linkToPreviousPromise(promise, prev) {
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
        promise._prev = prev;
        promise._numPrev = numPrev;
    }
}
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
}
function endMicroTickScope() {
    var callbacks, i, l;
    do {
        while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
            }
        }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(function (p) {
        p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0);
    var i = finalizers.length;
    while (i)
        finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
        fn();
        tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap(function () {
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
    }, []);
}
function addPossiblyUnhandledError(promise) {
    if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
        unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
    var i = unhandledErrors.length;
    while (i)
        if (unhandledErrors[--i]._value === promise._value) {
            unhandledErrors.splice(i, 1);
            return;
        }
}
function PromiseReject(reason) {
    return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function () {
        var wasRootExec = beginMicroTickScope(), outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
        }
        catch (e) {
            errorCatcher && errorCatcher(e);
        }
        finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
                endMicroTickScope();
        }
    };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    var globalEnv = globalPSD.env;
    psd.env = patchGlobalPromise ? {
        Promise: DexiePromise,
        PromiseProp: { value: DexiePromise, configurable: true, writable: true },
        all: DexiePromise.all,
        race: DexiePromise.race,
        allSettled: DexiePromise.allSettled,
        any: DexiePromise.any,
        resolve: DexiePromise.resolve,
        reject: DexiePromise.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
    } : {};
    if (props)
        extend(psd, props);
    ++parent.ref;
    psd.finalize = function () {
        --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
        psd.finalize();
    return rv;
}
function incrementExpectedAwaits() {
    if (!task.id)
        task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
}
function decrementExpectedAwaits() {
    if (!task.awaits)
        return false;
    if (--task.awaits === 0)
        task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT;
    return true;
}
if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
    incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
        incrementExpectedAwaits();
        return possiblePromise.then(function (x) {
            decrementExpectedAwaits();
            return x;
        }, function (e) {
            decrementExpectedAwaits();
            return rejection(e);
        });
    }
    return possiblePromise;
}
function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
        task.echoes = task.id = 0;
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
        enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
        return;
    PSD = targetZone;
    if (currentZone === globalPSD)
        globalPSD.env = snapShot();
    if (patchGlobalPromise) {
        var GlobalPromise_1 = globalPSD.env.Promise;
        var targetEnv = targetZone.env;
        nativePromiseProto.then = targetEnv.nthen;
        GlobalPromise_1.prototype.then = targetEnv.gthen;
        if (currentZone.global || targetZone.global) {
            Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
            GlobalPromise_1.all = targetEnv.all;
            GlobalPromise_1.race = targetEnv.race;
            GlobalPromise_1.resolve = targetEnv.resolve;
            GlobalPromise_1.reject = targetEnv.reject;
            if (targetEnv.allSettled)
                GlobalPromise_1.allSettled = targetEnv.allSettled;
            if (targetEnv.any)
                GlobalPromise_1.any = targetEnv.any;
        }
    }
}
function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        allSettled: GlobalPromise.allSettled,
        any: GlobalPromise.any,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then
    } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
        switchToZone(psd, true);
        return fn(a1, a2, a3);
    }
    finally {
        switchToZone(outerScope, false);
    }
}
function enqueueNativeMicroTask(job) {
    nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
    return typeof fn !== 'function' ? fn : function () {
        var outerZone = PSD;
        if (possibleAwait)
            incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            switchToZone(outerZone, false);
            if (cleanup)
                enqueueNativeMicroTask(decrementExpectedAwaits);
        }
    };
}
function getPatchedPromiseThen(origThen, zone) {
    return function (onResolved, onRejected) {
        return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
    };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
    var rv;
    try {
        rv = promise.onuncatched(err);
    }
    catch (e) { }
    if (rv !== false)
        try {
            var event, eventData = { promise: promise, reason: err };
            if (_global.document && document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(UNHANDLEDREJECTION, true, true);
                extend(event, eventData);
            }
            else if (_global.CustomEvent) {
                event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                extend(event, eventData);
            }
            if (event && _global.dispatchEvent) {
                dispatchEvent(event);
                if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                    try {
                        _global.onunhandledrejection(event);
                    }
                    catch (_) { }
            }
            if (debug && event && !event.defaultPrevented) {
                console.warn("Unhandled rejection: " + (err.stack || err));
            }
        }
        catch (e) { }
}
var rejection = DexiePromise.reject;

function tempTransaction(db, mode, storeNames, fn) {
    if (!db.idbdb || (!db._state.openComplete && (!PSD.letThrough && !db._vip))) {
        if (db._state.openComplete) {
            return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
        }
        if (!db._state.isBeingOpened) {
            if (!db._options.autoOpen)
                return rejection(new exceptions.DatabaseClosed());
            db.open().catch(nop);
        }
        return db._state.dbReadyPromise.then(function () { return tempTransaction(db, mode, storeNames, fn); });
    }
    else {
        var trans = db._createTransaction(mode, storeNames, db._dbSchema);
        try {
            trans.create();
            db._state.PR1398_maxLoop = 3;
        }
        catch (ex) {
            if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                console.warn('Dexie: Need to reopen db');
                db._close();
                return db.open().then(function () { return tempTransaction(db, mode, storeNames, fn); });
            }
            return rejection(ex);
        }
        return trans._promise(mode, function (resolve, reject) {
            return newScope(function () {
                PSD.trans = trans;
                return fn(resolve, reject, trans);
            });
        }).then(function (result) {
            return trans._completion.then(function () { return result; });
        });
    }
}

var DEXIE_VERSION = '3.2.2';
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
var DBNAMES_DB = '__dbnames';
var READONLY = 'readonly';
var READWRITE = 'readwrite';

function combine(filter1, filter2) {
    return filter1 ?
        filter2 ?
            function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
            filter1 :
        filter2;
}

var AnyRange = {
    type: 3 ,
    lower: -Infinity,
    lowerOpen: false,
    upper: [[]],
    upperOpen: false
};

function workaroundForUndefinedPrimKey(keyPath) {
    return typeof keyPath === "string" && !/\./.test(keyPath)
        ? function (obj) {
            if (obj[keyPath] === undefined && (keyPath in obj)) {
                obj = deepClone(obj);
                delete obj[keyPath];
            }
            return obj;
        }
        : function (obj) { return obj; };
}

var Table =  (function () {
    function Table() {
    }
    Table.prototype._trans = function (mode, fn, writeLocked) {
        var trans = this._tx || PSD.trans;
        var tableName = this.name;
        function checkTableInTransaction(resolve, reject, trans) {
            if (!trans.schema[tableName])
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans.idbtrans, trans);
        }
        var wasRootExec = beginMicroTickScope();
        try {
            return trans && trans.db === this.db ?
                trans === PSD.trans ?
                    trans._promise(mode, checkTableInTransaction, writeLocked) :
                    newScope(function () { return trans._promise(mode, checkTableInTransaction, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
        }
        finally {
            if (wasRootExec)
                endMicroTickScope();
        }
    };
    Table.prototype.get = function (keyOrCrit, cb) {
        var _this = this;
        if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
        return this._trans('readonly', function (trans) {
            return _this.core.get({ trans: trans, key: keyOrCrit })
                .then(function (res) { return _this.hook.reading.fire(res); });
        }).then(cb);
    };
    Table.prototype.where = function (indexOrCrit) {
        if (typeof indexOrCrit === 'string')
            return new this.db.WhereClause(this, indexOrCrit);
        if (isArray(indexOrCrit))
            return new this.db.WhereClause(this, "[" + indexOrCrit.join('+') + "]");
        var keyPaths = keys(indexOrCrit);
        if (keyPaths.length === 1)
            return this
                .where(keyPaths[0])
                .equals(indexOrCrit[keyPaths[0]]);
        var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
            return ix.compound &&
                keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
        })[0];
        if (compoundIndex && this.db._maxKey !== maxString)
            return this
                .where(compoundIndex.name)
                .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
        if (!compoundIndex && debug)
            console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                ("compound index [" + keyPaths.join('+') + "]"));
        var idxByName = this.schema.idxByName;
        var idb = this.db._deps.indexedDB;
        function equals(a, b) {
            try {
                return idb.cmp(a, b) === 0;
            }
            catch (e) {
                return false;
            }
        }
        var _a = keyPaths.reduce(function (_a, keyPath) {
            var prevIndex = _a[0], prevFilterFn = _a[1];
            var index = idxByName[keyPath];
            var value = indexOrCrit[keyPath];
            return [
                prevIndex || index,
                prevIndex || !index ?
                    combine(prevFilterFn, index && index.multi ?
                        function (x) {
                            var prop = getByKeyPath(x, keyPath);
                            return isArray(prop) && prop.some(function (item) { return equals(value, item); });
                        } : function (x) { return equals(value, getByKeyPath(x, keyPath)); })
                    : prevFilterFn
            ];
        }, [null, null]), idx = _a[0], filterFunction = _a[1];
        return idx ?
            this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                .filter(filterFunction) :
            compoundIndex ?
                this.filter(filterFunction) :
                this.where(keyPaths).equals('');
    };
    Table.prototype.filter = function (filterFunction) {
        return this.toCollection().and(filterFunction);
    };
    Table.prototype.count = function (thenShortcut) {
        return this.toCollection().count(thenShortcut);
    };
    Table.prototype.offset = function (offset) {
        return this.toCollection().offset(offset);
    };
    Table.prototype.limit = function (numRows) {
        return this.toCollection().limit(numRows);
    };
    Table.prototype.each = function (callback) {
        return this.toCollection().each(callback);
    };
    Table.prototype.toArray = function (thenShortcut) {
        return this.toCollection().toArray(thenShortcut);
    };
    Table.prototype.toCollection = function () {
        return new this.db.Collection(new this.db.WhereClause(this));
    };
    Table.prototype.orderBy = function (index) {
        return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
            "[" + index.join('+') + "]" :
            index));
    };
    Table.prototype.reverse = function () {
        return this.toCollection().reverse();
    };
    Table.prototype.mapToClass = function (constructor) {
        this.schema.mappedClass = constructor;
        var readHook = function (obj) {
            if (!obj)
                return obj;
            var res = Object.create(constructor.prototype);
            for (var m in obj)
                if (hasOwn(obj, m))
                    try {
                        res[m] = obj[m];
                    }
                    catch (_) { }
            return res;
        };
        if (this.schema.readHook) {
            this.hook.reading.unsubscribe(this.schema.readHook);
        }
        this.schema.readHook = readHook;
        this.hook("reading", readHook);
        return constructor;
    };
    Table.prototype.defineClass = function () {
        function Class(content) {
            extend(this, content);
        }
        return this.mapToClass(Class);
    };
    Table.prototype.add = function (obj, key) {
        var _this = this;
        var _a = this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
        var objToAdd = obj;
        if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
        }
        return this._trans('readwrite', function (trans) {
            return _this.core.mutate({ trans: trans, type: 'add', keys: key != null ? [key] : null, values: [objToAdd] });
        }).then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
            .then(function (lastResult) {
            if (keyPath) {
                try {
                    setByKeyPath(obj, keyPath, lastResult);
                }
                catch (_) { }
            }
            return lastResult;
        });
    };
    Table.prototype.update = function (keyOrObject, modifications) {
        if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
            var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === undefined)
                return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            try {
                if (typeof modifications !== "function") {
                    keys(modifications).forEach(function (keyPath) {
                        setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                    });
                }
                else {
                    modifications(keyOrObject, { value: keyOrObject, primKey: key });
                }
            }
            catch (_a) {
            }
            return this.where(":id").equals(key).modify(modifications);
        }
        else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
        }
    };
    Table.prototype.put = function (obj, key) {
        var _this = this;
        var _a = this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
        var objToAdd = obj;
        if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
        }
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'put', values: [objToAdd], keys: key != null ? [key] : null }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
            .then(function (lastResult) {
            if (keyPath) {
                try {
                    setByKeyPath(obj, keyPath, lastResult);
                }
                catch (_) { }
            }
            return lastResult;
        });
    };
    Table.prototype.delete = function (key) {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'delete', keys: [key] }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
    };
    Table.prototype.clear = function () {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'deleteRange', range: AnyRange }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
    };
    Table.prototype.bulkGet = function (keys) {
        var _this = this;
        return this._trans('readonly', function (trans) {
            return _this.core.getMany({
                keys: keys,
                trans: trans
            }).then(function (result) { return result.map(function (res) { return _this.hook.reading.fire(res); }); });
        });
    };
    Table.prototype.bulkAdd = function (objects, keysOrOptions, options) {
        var _this = this;
        var keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys ? undefined : keysOrOptions);
        var wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', function (trans) {
            var _a = _this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
            if (keyPath && keys)
                throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys && keys.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToAdd = keyPath && auto ?
                objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                objects;
            return _this.core.mutate({ trans: trans, type: 'add', keys: keys, values: objectsToAdd, wantResults: wantResults })
                .then(function (_a) {
                var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", failures);
            });
        });
    };
    Table.prototype.bulkPut = function (objects, keysOrOptions, options) {
        var _this = this;
        var keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys ? undefined : keysOrOptions);
        var wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', function (trans) {
            var _a = _this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
            if (keyPath && keys)
                throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys && keys.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToPut = keyPath && auto ?
                objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                objects;
            return _this.core.mutate({ trans: trans, type: 'put', keys: keys, values: objectsToPut, wantResults: wantResults })
                .then(function (_a) {
                var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", failures);
            });
        });
    };
    Table.prototype.bulkDelete = function (keys) {
        var _this = this;
        var numKeys = keys.length;
        return this._trans('readwrite', function (trans) {
            return _this.core.mutate({ trans: trans, type: 'delete', keys: keys });
        }).then(function (_a) {
            var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
            if (numFailures === 0)
                return lastResult;
            throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
        });
    };
    return Table;
}());

function Events(ctx) {
    var evs = {};
    var rv = function (eventName, subscriber) {
        if (subscriber) {
            var i = arguments.length, args = new Array(i - 1);
            while (--i)
                args[i - 1] = arguments[i];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
        }
        else if (typeof (eventName) === 'string') {
            return evs[eventName];
        }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
        add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
        if (typeof eventName === 'object')
            return addConfiguredEvents(eventName);
        if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
        if (!defaultFunction)
            defaultFunction = nop;
        var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function (cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                    context.subscribers.push(cb);
                    context.fire = chainFunction(context.fire, cb);
                }
            },
            unsubscribe: function (cb) {
                context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
        };
        evs[eventName] = rv[eventName] = context;
        return context;
    }
    function addConfiguredEvents(cfg) {
        keys(cfg).forEach(function (eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
                add(eventName, cfg[eventName][0], cfg[eventName][1]);
            }
            else if (args === 'asap') {
                var context = add(eventName, mirror, function fire() {
                    var i = arguments.length, args = new Array(i);
                    while (i--)
                        args[i] = arguments[i];
                    context.subscribers.forEach(function (fn) {
                        asap$1(function fireEvent() {
                            fn.apply(null, args);
                        });
                    });
                });
            }
            else
                throw new exceptions.InvalidArgument("Invalid event config");
        });
    }
}

function makeClassConstructor(prototype, constructor) {
    derive(constructor).from({ prototype: prototype });
    return constructor;
}

function createTableConstructor(db) {
    return makeClassConstructor(Table.prototype, function Table(name, tableSchema, trans) {
        this.db = db;
        this._tx = trans;
        this.name = name;
        this.schema = tableSchema;
        this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
        });
    });
}

function isPlainKeyRange(ctx, ignoreLimitFilter) {
    return !(ctx.filter || ctx.algorithm || ctx.or) &&
        (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
    ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
    var curr = ctx.replayFilter;
    ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
    ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
    ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
    if (ctx.isPrimKey)
        return coreSchema.primaryKey;
    var index = coreSchema.getIndexByKeyPath(ctx.index);
    if (!index)
        throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
    return index;
}
function openCursor(ctx, coreTable, trans) {
    var index = getIndexOrStore(ctx, coreTable.schema);
    return coreTable.openCursor({
        trans: trans,
        values: !ctx.keysOnly,
        reverse: ctx.dir === 'prev',
        unique: !!ctx.unique,
        query: {
            index: index,
            range: ctx.range
        }
    });
}
function iter(ctx, fn, coreTrans, coreTable) {
    var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
    if (!ctx.or) {
        return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
    }
    else {
        var set_1 = {};
        var union = function (item, cursor, advance) {
            if (!filter || filter(cursor, advance, function (result) { return cursor.stop(result); }, function (err) { return cursor.fail(err); })) {
                var primaryKey = cursor.primaryKey;
                var key = '' + primaryKey;
                if (key === '[object ArrayBuffer]')
                    key = '' + new Uint8Array(primaryKey);
                if (!hasOwn(set_1, key)) {
                    set_1[key] = true;
                    fn(item, cursor, advance);
                }
            }
        };
        return Promise.all([
            ctx.or._iterate(union, coreTrans),
            iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
        ]);
    }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
    var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
    var wrappedFn = wrap(mappedFn);
    return cursorPromise.then(function (cursor) {
        if (cursor) {
            return cursor.start(function () {
                var c = function () { return cursor.continue(); };
                if (!filter || filter(cursor, function (advancer) { return c = advancer; }, function (val) { cursor.stop(val); c = nop; }, function (e) { cursor.fail(e); c = nop; }))
                    wrappedFn(cursor.value, cursor, function (advancer) { return c = advancer; });
                c();
            });
        }
    });
}

function cmp(a, b) {
    try {
        var ta = type(a);
        var tb = type(b);
        if (ta !== tb) {
            if (ta === 'Array')
                return 1;
            if (tb === 'Array')
                return -1;
            if (ta === 'binary')
                return 1;
            if (tb === 'binary')
                return -1;
            if (ta === 'string')
                return 1;
            if (tb === 'string')
                return -1;
            if (ta === 'Date')
                return 1;
            if (tb !== 'Date')
                return NaN;
            return -1;
        }
        switch (ta) {
            case 'number':
            case 'Date':
            case 'string':
                return a > b ? 1 : a < b ? -1 : 0;
            case 'binary': {
                return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
            }
            case 'Array':
                return compareArrays(a, b);
        }
    }
    catch (_a) { }
    return NaN;
}
function compareArrays(a, b) {
    var al = a.length;
    var bl = b.length;
    var l = al < bl ? al : bl;
    for (var i = 0; i < l; ++i) {
        var res = cmp(a[i], b[i]);
        if (res !== 0)
            return res;
    }
    return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
    var al = a.length;
    var bl = b.length;
    var l = al < bl ? al : bl;
    for (var i = 0; i < l; ++i) {
        if (a[i] !== b[i])
            return a[i] < b[i] ? -1 : 1;
    }
    return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
    var t = typeof x;
    if (t !== 'object')
        return t;
    if (ArrayBuffer.isView(x))
        return 'binary';
    var tsTag = toStringTag(x);
    return tsTag === 'ArrayBuffer' ? 'binary' : tsTag;
}
function getUint8Array(a) {
    if (a instanceof Uint8Array)
        return a;
    if (ArrayBuffer.isView(a))
        return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    return new Uint8Array(a);
}

var Collection =  (function () {
    function Collection() {
    }
    Collection.prototype._read = function (fn, cb) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readonly', fn).then(cb);
    };
    Collection.prototype._write = function (fn) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readwrite', fn, "locked");
    };
    Collection.prototype._addAlgorithm = function (fn) {
        var ctx = this._ctx;
        ctx.algorithm = combine(ctx.algorithm, fn);
    };
    Collection.prototype._iterate = function (fn, coreTrans) {
        return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
    };
    Collection.prototype.clone = function (props) {
        var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
        if (props)
            extend(ctx, props);
        rv._ctx = ctx;
        return rv;
    };
    Collection.prototype.raw = function () {
        this._ctx.valueMapper = null;
        return this;
    };
    Collection.prototype.each = function (fn) {
        var ctx = this._ctx;
        return this._read(function (trans) { return iter(ctx, fn, trans, ctx.table.core); });
    };
    Collection.prototype.count = function (cb) {
        var _this = this;
        return this._read(function (trans) {
            var ctx = _this._ctx;
            var coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
                return coreTable.count({
                    trans: trans,
                    query: {
                        index: getIndexOrStore(ctx, coreTable.schema),
                        range: ctx.range
                    }
                }).then(function (count) { return Math.min(count, ctx.limit); });
            }
            else {
                var count = 0;
                return iter(ctx, function () { ++count; return false; }, trans, coreTable)
                    .then(function () { return count; });
            }
        }).then(cb);
    };
    Collection.prototype.sortBy = function (keyPath, cb) {
        var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
        function getval(obj, i) {
            if (i)
                return getval(obj[parts[i]], i - 1);
            return obj[lastPart];
        }
        var order = this._ctx.dir === "next" ? 1 : -1;
        function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return aVal < bVal ? -order : aVal > bVal ? order : 0;
        }
        return this.toArray(function (a) {
            return a.sort(sorter);
        }).then(cb);
    };
    Collection.prototype.toArray = function (cb) {
        var _this = this;
        return this._read(function (trans) {
            var ctx = _this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                var valueMapper_1 = ctx.valueMapper;
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans: trans,
                    limit: ctx.limit,
                    values: true,
                    query: {
                        index: index,
                        range: ctx.range
                    }
                }).then(function (_a) {
                    var result = _a.result;
                    return valueMapper_1 ? result.map(valueMapper_1) : result;
                });
            }
            else {
                var a_1 = [];
                return iter(ctx, function (item) { return a_1.push(item); }, trans, ctx.table.core).then(function () { return a_1; });
            }
        }, cb);
    };
    Collection.prototype.offset = function (offset) {
        var ctx = this._ctx;
        if (offset <= 0)
            return this;
        ctx.offset += offset;
        if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, function () {
                var offsetLeft = offset;
                return function (cursor, advance) {
                    if (offsetLeft === 0)
                        return true;
                    if (offsetLeft === 1) {
                        --offsetLeft;
                        return false;
                    }
                    advance(function () {
                        cursor.advance(offsetLeft);
                        offsetLeft = 0;
                    });
                    return false;
                };
            });
        }
        else {
            addReplayFilter(ctx, function () {
                var offsetLeft = offset;
                return function () { return (--offsetLeft < 0); };
            });
        }
        return this;
    };
    Collection.prototype.limit = function (numRows) {
        this._ctx.limit = Math.min(this._ctx.limit, numRows);
        addReplayFilter(this._ctx, function () {
            var rowsLeft = numRows;
            return function (cursor, advance, resolve) {
                if (--rowsLeft <= 0)
                    advance(resolve);
                return rowsLeft >= 0;
            };
        }, true);
        return this;
    };
    Collection.prototype.until = function (filterFunction, bIncludeStopEntry) {
        addFilter(this._ctx, function (cursor, advance, resolve) {
            if (filterFunction(cursor.value)) {
                advance(resolve);
                return bIncludeStopEntry;
            }
            else {
                return true;
            }
        });
        return this;
    };
    Collection.prototype.first = function (cb) {
        return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
    };
    Collection.prototype.last = function (cb) {
        return this.reverse().first(cb);
    };
    Collection.prototype.filter = function (filterFunction) {
        addFilter(this._ctx, function (cursor) {
            return filterFunction(cursor.value);
        });
        addMatchFilter(this._ctx, filterFunction);
        return this;
    };
    Collection.prototype.and = function (filter) {
        return this.filter(filter);
    };
    Collection.prototype.or = function (indexName) {
        return new this.db.WhereClause(this._ctx.table, indexName, this);
    };
    Collection.prototype.reverse = function () {
        this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
        if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
        return this;
    };
    Collection.prototype.desc = function () {
        return this.reverse();
    };
    Collection.prototype.eachKey = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.key, cursor); });
    };
    Collection.prototype.eachUniqueKey = function (cb) {
        this._ctx.unique = "unique";
        return this.eachKey(cb);
    };
    Collection.prototype.eachPrimaryKey = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
    };
    Collection.prototype.keys = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.key);
        }).then(function () {
            return a;
        }).then(cb);
    };
    Collection.prototype.primaryKeys = function (cb) {
        var ctx = this._ctx;
        if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(function (trans) {
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans: trans,
                    values: false,
                    limit: ctx.limit,
                    query: {
                        index: index,
                        range: ctx.range
                    }
                });
            }).then(function (_a) {
                var result = _a.result;
                return result;
            }).then(cb);
        }
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.primaryKey);
        }).then(function () {
            return a;
        }).then(cb);
    };
    Collection.prototype.uniqueKeys = function (cb) {
        this._ctx.unique = "unique";
        return this.keys(cb);
    };
    Collection.prototype.firstKey = function (cb) {
        return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
    };
    Collection.prototype.lastKey = function (cb) {
        return this.reverse().firstKey(cb);
    };
    Collection.prototype.distinct = function () {
        var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
        if (!idx || !idx.multi)
            return this;
        var set = {};
        addFilter(this._ctx, function (cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set, strKey);
            set[strKey] = true;
            return !found;
        });
        return this;
    };
    Collection.prototype.modify = function (changes) {
        var _this = this;
        var ctx = this._ctx;
        return this._write(function (trans) {
            var modifyer;
            if (typeof changes === 'function') {
                modifyer = changes;
            }
            else {
                var keyPaths = keys(changes);
                var numKeys = keyPaths.length;
                modifyer = function (item) {
                    var anythingModified = false;
                    for (var i = 0; i < numKeys; ++i) {
                        var keyPath = keyPaths[i], val = changes[keyPath];
                        if (getByKeyPath(item, keyPath) !== val) {
                            setByKeyPath(item, keyPath, val);
                            anythingModified = true;
                        }
                    }
                    return anythingModified;
                };
            }
            var coreTable = ctx.table.core;
            var _a = coreTable.schema.primaryKey, outbound = _a.outbound, extractKey = _a.extractKey;
            var limit = _this.db._options.modifyChunkSize || 200;
            var totalFailures = [];
            var successCount = 0;
            var failedKeys = [];
            var applyMutateResult = function (expectedCount, res) {
                var failures = res.failures, numFailures = res.numFailures;
                successCount += expectedCount - numFailures;
                for (var _i = 0, _a = keys(failures); _i < _a.length; _i++) {
                    var pos = _a[_i];
                    totalFailures.push(failures[pos]);
                }
            };
            return _this.clone().primaryKeys().then(function (keys) {
                var nextChunk = function (offset) {
                    var count = Math.min(limit, keys.length - offset);
                    return coreTable.getMany({
                        trans: trans,
                        keys: keys.slice(offset, offset + count),
                        cache: "immutable"
                    }).then(function (values) {
                        var addValues = [];
                        var putValues = [];
                        var putKeys = outbound ? [] : null;
                        var deleteKeys = [];
                        for (var i = 0; i < count; ++i) {
                            var origValue = values[i];
                            var ctx_1 = {
                                value: deepClone(origValue),
                                primKey: keys[offset + i]
                            };
                            if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                                if (ctx_1.value == null) {
                                    deleteKeys.push(keys[offset + i]);
                                }
                                else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                                    deleteKeys.push(keys[offset + i]);
                                    addValues.push(ctx_1.value);
                                }
                                else {
                                    putValues.push(ctx_1.value);
                                    if (outbound)
                                        putKeys.push(keys[offset + i]);
                                }
                            }
                        }
                        var criteria = isPlainKeyRange(ctx) &&
                            ctx.limit === Infinity &&
                            (typeof changes !== 'function' || changes === deleteCallback) && {
                            index: ctx.index,
                            range: ctx.range
                        };
                        return Promise.resolve(addValues.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'add', values: addValues })
                                .then(function (res) {
                                for (var pos in res.failures) {
                                    deleteKeys.splice(parseInt(pos), 1);
                                }
                                applyMutateResult(addValues.length, res);
                            })).then(function () { return (putValues.length > 0 || (criteria && typeof changes === 'object')) &&
                            coreTable.mutate({
                                trans: trans,
                                type: 'put',
                                keys: putKeys,
                                values: putValues,
                                criteria: criteria,
                                changeSpec: typeof changes !== 'function'
                                    && changes
                            }).then(function (res) { return applyMutateResult(putValues.length, res); }); }).then(function () { return (deleteKeys.length > 0 || (criteria && changes === deleteCallback)) &&
                            coreTable.mutate({
                                trans: trans,
                                type: 'delete',
                                keys: deleteKeys,
                                criteria: criteria
                            }).then(function (res) { return applyMutateResult(deleteKeys.length, res); }); }).then(function () {
                            return keys.length > offset + count && nextChunk(offset + limit);
                        });
                    });
                };
                return nextChunk(0).then(function () {
                    if (totalFailures.length > 0)
                        throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                    return keys.length;
                });
            });
        });
    };
    Collection.prototype.delete = function () {
        var ctx = this._ctx, range = ctx.range;
        if (isPlainKeyRange(ctx) &&
            ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3 ))
         {
            return this._write(function (trans) {
                var primaryKey = ctx.table.core.schema.primaryKey;
                var coreRange = range;
                return ctx.table.core.count({ trans: trans, query: { index: primaryKey, range: coreRange } }).then(function (count) {
                    return ctx.table.core.mutate({ trans: trans, type: 'deleteRange', range: coreRange })
                        .then(function (_a) {
                        var failures = _a.failures; _a.lastResult; _a.results; var numFailures = _a.numFailures;
                        if (numFailures)
                            throw new ModifyError("Could not delete some values", Object.keys(failures).map(function (pos) { return failures[pos]; }), count - numFailures);
                        return count - numFailures;
                    });
                });
            });
        }
        return this.modify(deleteCallback);
    };
    return Collection;
}());
var deleteCallback = function (value, ctx) { return ctx.value = null; };

function createCollectionConstructor(db) {
    return makeClassConstructor(Collection.prototype, function Collection(whereClause, keyRangeGenerator) {
        this.db = db;
        var keyRange = AnyRange, error = null;
        if (keyRangeGenerator)
            try {
                keyRange = keyRangeGenerator();
            }
            catch (ex) {
                error = ex;
            }
        var whereCtx = whereClause._ctx;
        var table = whereCtx.table;
        var readingHook = table.hook.reading.fire;
        this._ctx = {
            table: table,
            index: whereCtx.index,
            isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error: error,
            or: whereCtx.or,
            valueMapper: readingHook !== mirror ? readingHook : null
        };
    });
}

function simpleCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
    return a > b ? -1 : a === b ? 0 : 1;
}

function fail(collectionOrWhereClause, err, T) {
    var collection = collectionOrWhereClause instanceof WhereClause ?
        new collectionOrWhereClause.Collection(collectionOrWhereClause) :
        collectionOrWhereClause;
    collection._ctx.error = T ? new T(err) : new TypeError(err);
    return collection;
}
function emptyCollection(whereClause) {
    return new whereClause.Collection(whereClause, function () { return rangeEqual(""); }).limit(0);
}
function upperFactory(dir) {
    return dir === "next" ?
        function (s) { return s.toUpperCase(); } :
        function (s) { return s.toLowerCase(); };
}
function lowerFactory(dir) {
    return dir === "next" ?
        function (s) { return s.toLowerCase(); } :
        function (s) { return s.toUpperCase(); };
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
    var length = Math.min(key.length, lowerNeedle.length);
    var llp = -1;
    for (var i = 0; i < length; ++i) {
        var lwrKeyChar = lowerKey[i];
        if (lwrKeyChar !== lowerNeedle[i]) {
            if (cmp(key[i], upperNeedle[i]) < 0)
                return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
            if (cmp(key[i], lowerNeedle[i]) < 0)
                return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
            if (llp >= 0)
                return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
        }
        if (cmp(key[i], lwrKeyChar) < 0)
            llp = i;
    }
    if (length < lowerNeedle.length && dir === "next")
        return key + upperNeedle.substr(key.length);
    if (length < key.length && dir === "prev")
        return key.substr(0, upperNeedle.length);
    return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
    var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
    if (!needles.every(function (s) { return typeof s === 'string'; })) {
        return fail(whereClause, STRING_EXPECTED);
    }
    function initDirection(dir) {
        upper = upperFactory(dir);
        lower = lowerFactory(dir);
        compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
        var needleBounds = needles.map(function (needle) {
            return { lower: lower(needle), upper: upper(needle) };
        }).sort(function (a, b) {
            return compare(a.lower, b.lower);
        });
        upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
        lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
        direction = dir;
        nextKeySuffix = (dir === "next" ? "" : suffix);
    }
    initDirection("next");
    var c = new whereClause.Collection(whereClause, function () { return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix); });
    c._ondirectionchange = function (direction) {
        initDirection(direction);
    };
    var firstPossibleNeedle = 0;
    c._addAlgorithm(function (cursor, advance, resolve) {
        var key = cursor.key;
        if (typeof key !== 'string')
            return false;
        var lowerKey = lower(key);
        if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
            return true;
        }
        else {
            var lowestPossibleCasing = null;
            for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                if (casing === null && lowestPossibleCasing === null)
                    firstPossibleNeedle = i + 1;
                else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                    lowestPossibleCasing = casing;
                }
            }
            if (lowestPossibleCasing !== null) {
                advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
            }
            else {
                advance(resolve);
            }
            return false;
        }
    });
    return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
    return {
        type: 2 ,
        lower: lower,
        upper: upper,
        lowerOpen: lowerOpen,
        upperOpen: upperOpen
    };
}
function rangeEqual(value) {
    return {
        type: 1 ,
        lower: value,
        upper: value
    };
}

var WhereClause =  (function () {
    function WhereClause() {
    }
    Object.defineProperty(WhereClause.prototype, "Collection", {
        get: function () {
            return this._ctx.table.db.Collection;
        },
        enumerable: false,
        configurable: true
    });
    WhereClause.prototype.between = function (lower, upper, includeLower, includeUpper) {
        includeLower = includeLower !== false;
        includeUpper = includeUpper === true;
        try {
            if ((this._cmp(lower, upper) > 0) ||
                (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                return emptyCollection(this);
            return new this.Collection(this, function () { return createRange(lower, upper, !includeLower, !includeUpper); });
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
    };
    WhereClause.prototype.equals = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return rangeEqual(value); });
    };
    WhereClause.prototype.above = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(value, undefined, true); });
    };
    WhereClause.prototype.aboveOrEqual = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(value, undefined, false); });
    };
    WhereClause.prototype.below = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(undefined, value, false, true); });
    };
    WhereClause.prototype.belowOrEqual = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(undefined, value); });
    };
    WhereClause.prototype.startsWith = function (str) {
        if (typeof str !== 'string')
            return fail(this, STRING_EXPECTED);
        return this.between(str, str + maxString, true, true);
    };
    WhereClause.prototype.startsWithIgnoreCase = function (str) {
        if (str === "")
            return this.startsWith(str);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
    };
    WhereClause.prototype.equalsIgnoreCase = function (str) {
        return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
    };
    WhereClause.prototype.anyOfIgnoreCase = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
    };
    WhereClause.prototype.startsWithAnyOfIgnoreCase = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return a.some(function (n) { return x.indexOf(n) === 0; }); }, set, maxString);
    };
    WhereClause.prototype.anyOf = function () {
        var _this = this;
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        var compare = this._cmp;
        try {
            set.sort(compare);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        if (set.length === 0)
            return emptyCollection(this);
        var c = new this.Collection(this, function () { return createRange(set[0], set[set.length - 1]); });
        c._ondirectionchange = function (direction) {
            compare = (direction === "next" ?
                _this._ascending :
                _this._descending);
            set.sort(compare);
        };
        var i = 0;
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            while (compare(key, set[i]) > 0) {
                ++i;
                if (i === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (compare(key, set[i]) === 0) {
                return true;
            }
            else {
                advance(function () { cursor.continue(set[i]); });
                return false;
            }
        });
        return c;
    };
    WhereClause.prototype.notEqual = function (value) {
        return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    };
    WhereClause.prototype.noneOf = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return new this.Collection(this);
        try {
            set.sort(this._ascending);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        var ranges = set.reduce(function (res, val) { return res ?
            res.concat([[res[res.length - 1][1], val]]) :
            [[minKey, val]]; }, null);
        ranges.push([set[set.length - 1], this.db._maxKey]);
        return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
    };
    WhereClause.prototype.inAnyRange = function (ranges, options) {
        var _this = this;
        var cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
        if (ranges.length === 0)
            return emptyCollection(this);
        if (!ranges.every(function (range) {
            return range[0] !== undefined &&
                range[1] !== undefined &&
                ascending(range[0], range[1]) <= 0;
        })) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
        }
        var includeLowers = !options || options.includeLowers !== false;
        var includeUppers = options && options.includeUppers === true;
        function addRange(ranges, newRange) {
            var i = 0, l = ranges.length;
            for (; i < l; ++i) {
                var range = ranges[i];
                if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                    range[0] = min(range[0], newRange[0]);
                    range[1] = max(range[1], newRange[1]);
                    break;
                }
            }
            if (i === l)
                ranges.push(newRange);
            return ranges;
        }
        var sortDirection = ascending;
        function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
        var set;
        try {
            set = ranges.reduce(addRange, []);
            set.sort(rangeSorter);
        }
        catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        var rangePos = 0;
        var keyIsBeyondCurrentEntry = includeUppers ?
            function (key) { return ascending(key, set[rangePos][1]) > 0; } :
            function (key) { return ascending(key, set[rangePos][1]) >= 0; };
        var keyIsBeforeCurrentEntry = includeLowers ?
            function (key) { return descending(key, set[rangePos][0]) > 0; } :
            function (key) { return descending(key, set[rangePos][0]) >= 0; };
        function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
        }
        var checkKey = keyIsBeyondCurrentEntry;
        var c = new this.Collection(this, function () { return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers); });
        c._ondirectionchange = function (direction) {
            if (direction === "next") {
                checkKey = keyIsBeyondCurrentEntry;
                sortDirection = ascending;
            }
            else {
                checkKey = keyIsBeforeCurrentEntry;
                sortDirection = descending;
            }
            set.sort(rangeSorter);
        };
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            while (checkKey(key)) {
                ++rangePos;
                if (rangePos === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (keyWithinCurrentRange(key)) {
                return true;
            }
            else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                return false;
            }
            else {
                advance(function () {
                    if (sortDirection === ascending)
                        cursor.continue(set[rangePos][0]);
                    else
                        cursor.continue(set[rangePos][1]);
                });
                return false;
            }
        });
        return c;
    };
    WhereClause.prototype.startsWithAnyOf = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (!set.every(function (s) { return typeof s === 'string'; })) {
            return fail(this, "startsWithAnyOf() only works with strings");
        }
        if (set.length === 0)
            return emptyCollection(this);
        return this.inAnyRange(set.map(function (str) { return [str, str + maxString]; }));
    };
    return WhereClause;
}());

function createWhereClauseConstructor(db) {
    return makeClassConstructor(WhereClause.prototype, function WhereClause(table, index, orCollection) {
        this.db = db;
        this._ctx = {
            table: table,
            index: index === ":id" ? null : index,
            or: orCollection
        };
        var indexedDB = db._deps.indexedDB;
        if (!indexedDB)
            throw new exceptions.MissingAPI();
        this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
        this._descending = function (a, b) { return indexedDB.cmp(b, a); };
        this._max = function (a, b) { return indexedDB.cmp(a, b) > 0 ? a : b; };
        this._min = function (a, b) { return indexedDB.cmp(a, b) < 0 ? a : b; };
        this._IDBKeyRange = db._deps.IDBKeyRange;
    });
}

function eventRejectHandler(reject) {
    return wrap(function (event) {
        preventDefault(event);
        reject(event.target.error);
        return false;
    });
}
function preventDefault(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    if (event.preventDefault)
        event.preventDefault();
}

var DEXIE_STORAGE_MUTATED_EVENT_NAME = 'storagemutated';
var STORAGE_MUTATED_DOM_EVENT_NAME = 'x-storagemutated-1';
var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);

var Transaction =  (function () {
    function Transaction() {
    }
    Transaction.prototype._lock = function () {
        assert(!PSD.global);
        ++this._reculock;
        if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
        return this;
    };
    Transaction.prototype._unlock = function () {
        assert(!PSD.global);
        if (--this._reculock === 0) {
            if (!PSD.global)
                PSD.lockOwnerFor = null;
            while (this._blockedFuncs.length > 0 && !this._locked()) {
                var fnAndPSD = this._blockedFuncs.shift();
                try {
                    usePSD(fnAndPSD[1], fnAndPSD[0]);
                }
                catch (e) { }
            }
        }
        return this;
    };
    Transaction.prototype._locked = function () {
        return this._reculock && PSD.lockOwnerFor !== this;
    };
    Transaction.prototype.create = function (idbtrans) {
        var _this = this;
        if (!this.mode)
            return this;
        var idbdb = this.db.idbdb;
        var dbOpenError = this.db._state.dbOpenError;
        assert(!this.idbtrans);
        if (!idbtrans && !idbdb) {
            switch (dbOpenError && dbOpenError.name) {
                case "DatabaseClosedError":
                    throw new exceptions.DatabaseClosed(dbOpenError);
                case "MissingAPIError":
                    throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                default:
                    throw new exceptions.OpenFailed(dbOpenError);
            }
        }
        if (!this.active)
            throw new exceptions.TransactionInactive();
        assert(this._completion._state === null);
        idbtrans = this.idbtrans = idbtrans ||
            (this.db.core
                ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })
                : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
        idbtrans.onerror = wrap(function (ev) {
            preventDefault(ev);
            _this._reject(idbtrans.error);
        });
        idbtrans.onabort = wrap(function (ev) {
            preventDefault(ev);
            _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
            _this.active = false;
            _this.on("abort").fire(ev);
        });
        idbtrans.oncomplete = wrap(function () {
            _this.active = false;
            _this._resolve();
            if ('mutatedParts' in idbtrans) {
                globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
            }
        });
        return this;
    };
    Transaction.prototype._promise = function (mode, fn, bWriteLock) {
        var _this = this;
        if (mode === 'readwrite' && this.mode !== 'readwrite')
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
        if (!this.active)
            return rejection(new exceptions.TransactionInactive());
        if (this._locked()) {
            return new DexiePromise(function (resolve, reject) {
                _this._blockedFuncs.push([function () {
                        _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                    }, PSD]);
            });
        }
        else if (bWriteLock) {
            return newScope(function () {
                var p = new DexiePromise(function (resolve, reject) {
                    _this._lock();
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p.finally(function () { return _this._unlock(); });
                p._lib = true;
                return p;
            });
        }
        else {
            var p = new DexiePromise(function (resolve, reject) {
                var rv = fn(resolve, reject, _this);
                if (rv && rv.then)
                    rv.then(resolve, reject);
            });
            p._lib = true;
            return p;
        }
    };
    Transaction.prototype._root = function () {
        return this.parent ? this.parent._root() : this;
    };
    Transaction.prototype.waitFor = function (promiseLike) {
        var root = this._root();
        var promise = DexiePromise.resolve(promiseLike);
        if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(function () { return promise; });
        }
        else {
            root._waitingFor = promise;
            root._waitingQueue = [];
            var store = root.idbtrans.objectStore(root.storeNames[0]);
            (function spin() {
                ++root._spinCount;
                while (root._waitingQueue.length)
                    (root._waitingQueue.shift())();
                if (root._waitingFor)
                    store.get(-Infinity).onsuccess = spin;
            }());
        }
        var currentWaitPromise = root._waitingFor;
        return new DexiePromise(function (resolve, reject) {
            promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                if (root._waitingFor === currentWaitPromise) {
                    root._waitingFor = null;
                }
            });
        });
    };
    Transaction.prototype.abort = function () {
        if (this.active) {
            this.active = false;
            if (this.idbtrans)
                this.idbtrans.abort();
            this._reject(new exceptions.Abort());
        }
    };
    Transaction.prototype.table = function (tableName) {
        var memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
        if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
        var tableSchema = this.schema[tableName];
        if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
        }
        var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
        transactionBoundTable.core = this.db.core.table(tableName);
        memoizedTables[tableName] = transactionBoundTable;
        return transactionBoundTable;
    };
    return Transaction;
}());

function createTransactionConstructor(db) {
    return makeClassConstructor(Transaction.prototype, function Transaction(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
        var _this = this;
        this.db = db;
        this.mode = mode;
        this.storeNames = storeNames;
        this.schema = dbschema;
        this.chromeTransactionDurability = chromeTransactionDurability;
        this.idbtrans = null;
        this.on = Events(this, "complete", "error", "abort");
        this.parent = parent || null;
        this.active = true;
        this._reculock = 0;
        this._blockedFuncs = [];
        this._resolve = null;
        this._reject = null;
        this._waitingFor = null;
        this._waitingQueue = null;
        this._spinCount = 0;
        this._completion = new DexiePromise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this._completion.then(function () {
            _this.active = false;
            _this.on.complete.fire();
        }, function (e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ?
                _this.parent._reject(e) :
                wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e);
        });
    });
}

function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
    return {
        name: name,
        keyPath: keyPath,
        unique: unique,
        multi: multi,
        auto: auto,
        compound: compound,
        src: (unique && !isPrimKey ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
    };
}
function nameFromKeyPath(keyPath) {
    return typeof keyPath === 'string' ?
        keyPath :
        keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
}

function createTableSchema(name, primKey, indexes) {
    return {
        name: name,
        primKey: primKey,
        indexes: indexes,
        mappedClass: null,
        idxByName: arrayToObject(indexes, function (index) { return [index.name, index]; })
    };
}

function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = function (IdbKeyRange) {
    try {
        IdbKeyRange.only([[]]);
        getMaxKey = function () { return [[]]; };
        return [[]];
    }
    catch (e) {
        getMaxKey = function () { return maxString; };
        return maxString;
    }
};

function getKeyExtractor(keyPath) {
    if (keyPath == null) {
        return function () { return undefined; };
    }
    else if (typeof keyPath === 'string') {
        return getSinglePathKeyExtractor(keyPath);
    }
    else {
        return function (obj) { return getByKeyPath(obj, keyPath); };
    }
}
function getSinglePathKeyExtractor(keyPath) {
    var split = keyPath.split('.');
    if (split.length === 1) {
        return function (obj) { return obj[keyPath]; };
    }
    else {
        return function (obj) { return getByKeyPath(obj, keyPath); };
    }
}

function arrayify(arrayLike) {
    return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
    return keyPath == null ?
        ":id" :
        typeof keyPath === 'string' ?
            keyPath :
            "[" + keyPath.join('+') + "]";
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
    function extractSchema(db, trans) {
        var tables = arrayify(db.objectStoreNames);
        return {
            schema: {
                name: db.name,
                tables: tables.map(function (table) { return trans.objectStore(table); }).map(function (store) {
                    var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                    var compound = isArray(keyPath);
                    var outbound = keyPath == null;
                    var indexByKeyPath = {};
                    var result = {
                        name: store.name,
                        primaryKey: {
                            name: null,
                            isPrimaryKey: true,
                            outbound: outbound,
                            compound: compound,
                            keyPath: keyPath,
                            autoIncrement: autoIncrement,
                            unique: true,
                            extractKey: getKeyExtractor(keyPath)
                        },
                        indexes: arrayify(store.indexNames).map(function (indexName) { return store.index(indexName); })
                            .map(function (index) {
                            var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath = index.keyPath;
                            var compound = isArray(keyPath);
                            var result = {
                                name: name,
                                compound: compound,
                                keyPath: keyPath,
                                unique: unique,
                                multiEntry: multiEntry,
                                extractKey: getKeyExtractor(keyPath)
                            };
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                            return result;
                        }),
                        getIndexByKeyPath: function (keyPath) { return indexByKeyPath[getKeyPathAlias(keyPath)]; }
                    };
                    indexByKeyPath[":id"] = result.primaryKey;
                    if (keyPath != null) {
                        indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                    }
                    return result;
                })
            },
            hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
        };
    }
    function makeIDBKeyRange(range) {
        if (range.type === 3 )
            return null;
        if (range.type === 4 )
            throw new Error("Cannot convert never type to IDBKeyRange");
        var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
        var idbRange = lower === undefined ?
            upper === undefined ?
                null :
                IdbKeyRange.upperBound(upper, !!upperOpen) :
            upper === undefined ?
                IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
        return idbRange;
    }
    function createDbCoreTable(tableSchema) {
        var tableName = tableSchema.name;
        function mutate(_a) {
            var trans = _a.trans, type = _a.type, keys = _a.keys, values = _a.values, range = _a.range;
            return new Promise(function (resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var outbound = store.keyPath == null;
                var isAddOrPut = type === "put" || type === "add";
                if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                    throw new Error("Invalid operation type: " + type);
                var length = (keys || values || { length: 1 }).length;
                if (keys && values && keys.length !== values.length) {
                    throw new Error("Given keys array must have same length as given values array.");
                }
                if (length === 0)
                    return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                var req;
                var reqs = [];
                var failures = [];
                var numFailures = 0;
                var errorHandler = function (event) {
                    ++numFailures;
                    preventDefault(event);
                };
                if (type === 'deleteRange') {
                    if (range.type === 4 )
                        return resolve({ numFailures: numFailures, failures: failures, results: [], lastResult: undefined });
                    if (range.type === 3 )
                        reqs.push(req = store.clear());
                    else
                        reqs.push(req = store.delete(makeIDBKeyRange(range)));
                }
                else {
                    var _a = isAddOrPut ?
                        outbound ?
                            [values, keys] :
                            [values, null] :
                        [keys, null], args1 = _a[0], args2 = _a[1];
                    if (isAddOrPut) {
                        for (var i = 0; i < length; ++i) {
                            reqs.push(req = (args2 && args2[i] !== undefined ?
                                store[type](args1[i], args2[i]) :
                                store[type](args1[i])));
                            req.onerror = errorHandler;
                        }
                    }
                    else {
                        for (var i = 0; i < length; ++i) {
                            reqs.push(req = store[type](args1[i]));
                            req.onerror = errorHandler;
                        }
                    }
                }
                var done = function (event) {
                    var lastResult = event.target.result;
                    reqs.forEach(function (req, i) { return req.error != null && (failures[i] = req.error); });
                    resolve({
                        numFailures: numFailures,
                        failures: failures,
                        results: type === "delete" ? keys : reqs.map(function (req) { return req.result; }),
                        lastResult: lastResult
                    });
                };
                req.onerror = function (event) {
                    errorHandler(event);
                    done(event);
                };
                req.onsuccess = done;
            });
        }
        function openCursor(_a) {
            var trans = _a.trans, values = _a.values, query = _a.query, reverse = _a.reverse, unique = _a.unique;
            return new Promise(function (resolve, reject) {
                resolve = wrap(resolve);
                var index = query.index, range = query.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ?
                    store :
                    store.index(index.name);
                var direction = reverse ?
                    unique ?
                        "prevunique" :
                        "prev" :
                    unique ?
                        "nextunique" :
                        "next";
                var req = values || !('openKeyCursor' in source) ?
                    source.openCursor(makeIDBKeyRange(range), direction) :
                    source.openKeyCursor(makeIDBKeyRange(range), direction);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function (ev) {
                    var cursor = req.result;
                    if (!cursor) {
                        resolve(null);
                        return;
                    }
                    cursor.___id = ++_id_counter;
                    cursor.done = false;
                    var _cursorContinue = cursor.continue.bind(cursor);
                    var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                    if (_cursorContinuePrimaryKey)
                        _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                    var _cursorAdvance = cursor.advance.bind(cursor);
                    var doThrowCursorIsNotStarted = function () { throw new Error("Cursor not started"); };
                    var doThrowCursorIsStopped = function () { throw new Error("Cursor not stopped"); };
                    cursor.trans = trans;
                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                    cursor.fail = wrap(reject);
                    cursor.next = function () {
                        var _this = this;
                        var gotOne = 1;
                        return this.start(function () { return gotOne-- ? _this.continue() : _this.stop(); }).then(function () { return _this; });
                    };
                    cursor.start = function (callback) {
                        var iterationPromise = new Promise(function (resolveIteration, rejectIteration) {
                            resolveIteration = wrap(resolveIteration);
                            req.onerror = eventRejectHandler(rejectIteration);
                            cursor.fail = rejectIteration;
                            cursor.stop = function (value) {
                                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                resolveIteration(value);
                            };
                        });
                        var guardedCallback = function () {
                            if (req.result) {
                                try {
                                    callback();
                                }
                                catch (err) {
                                    cursor.fail(err);
                                }
                            }
                            else {
                                cursor.done = true;
                                cursor.start = function () { throw new Error("Cursor behind last entry"); };
                                cursor.stop();
                            }
                        };
                        req.onsuccess = wrap(function (ev) {
                            req.onsuccess = guardedCallback;
                            guardedCallback();
                        });
                        cursor.continue = _cursorContinue;
                        cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                        cursor.advance = _cursorAdvance;
                        guardedCallback();
                        return iterationPromise;
                    };
                    resolve(cursor);
                }, reject);
            });
        }
        function query(hasGetAll) {
            return function (request) {
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var trans = request.trans, values = request.values, limit = request.limit, query = request.query;
                    var nonInfinitLimit = limit === Infinity ? undefined : limit;
                    var index = query.index, range = query.range;
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ? store : store.index(index.name);
                    var idbKeyRange = makeIDBKeyRange(range);
                    if (limit === 0)
                        return resolve({ result: [] });
                    if (hasGetAll) {
                        var req = values ?
                            source.getAll(idbKeyRange, nonInfinitLimit) :
                            source.getAllKeys(idbKeyRange, nonInfinitLimit);
                        req.onsuccess = function (event) { return resolve({ result: event.target.result }); };
                        req.onerror = eventRejectHandler(reject);
                    }
                    else {
                        var count_1 = 0;
                        var req_1 = values || !('openKeyCursor' in source) ?
                            source.openCursor(idbKeyRange) :
                            source.openKeyCursor(idbKeyRange);
                        var result_1 = [];
                        req_1.onsuccess = function (event) {
                            var cursor = req_1.result;
                            if (!cursor)
                                return resolve({ result: result_1 });
                            result_1.push(values ? cursor.value : cursor.primaryKey);
                            if (++count_1 === limit)
                                return resolve({ result: result_1 });
                            cursor.continue();
                        };
                        req_1.onerror = eventRejectHandler(reject);
                    }
                });
            };
        }
        return {
            name: tableName,
            schema: tableSchema,
            mutate: mutate,
            getMany: function (_a) {
                var trans = _a.trans, keys = _a.keys;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var length = keys.length;
                    var result = new Array(length);
                    var keyCount = 0;
                    var callbackCount = 0;
                    var req;
                    var successHandler = function (event) {
                        var req = event.target;
                        if ((result[req._pos] = req.result) != null)
                            ;
                        if (++callbackCount === keyCount)
                            resolve(result);
                    };
                    var errorHandler = eventRejectHandler(reject);
                    for (var i = 0; i < length; ++i) {
                        var key = keys[i];
                        if (key != null) {
                            req = store.get(keys[i]);
                            req._pos = i;
                            req.onsuccess = successHandler;
                            req.onerror = errorHandler;
                            ++keyCount;
                        }
                    }
                    if (keyCount === 0)
                        resolve(result);
                });
            },
            get: function (_a) {
                var trans = _a.trans, key = _a.key;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var req = store.get(key);
                    req.onsuccess = function (event) { return resolve(event.target.result); };
                    req.onerror = eventRejectHandler(reject);
                });
            },
            query: query(hasGetAll),
            openCursor: openCursor,
            count: function (_a) {
                var query = _a.query, trans = _a.trans;
                var index = query.index, range = query.range;
                return new Promise(function (resolve, reject) {
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ? store : store.index(index.name);
                    var idbKeyRange = makeIDBKeyRange(range);
                    var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                    req.onsuccess = wrap(function (ev) { return resolve(ev.target.result); });
                    req.onerror = eventRejectHandler(reject);
                });
            }
        };
    }
    var _a = extractSchema(db, tmpTrans), schema = _a.schema, hasGetAll = _a.hasGetAll;
    var tables = schema.tables.map(function (tableSchema) { return createDbCoreTable(tableSchema); });
    var tableMap = {};
    tables.forEach(function (table) { return tableMap[table.name] = table; });
    return {
        stack: "dbcore",
        transaction: db.transaction.bind(db),
        table: function (name) {
            var result = tableMap[name];
            if (!result)
                throw new Error("Table '" + name + "' not found");
            return tableMap[name];
        },
        MIN_KEY: -Infinity,
        MAX_KEY: getMaxKey(IdbKeyRange),
        schema: schema
    };
}

function createMiddlewareStack(stackImpl, middlewares) {
    return middlewares.reduce(function (down, _a) {
        var create = _a.create;
        return (__assign(__assign({}, down), create(down)));
    }, stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, _a, tmpTrans) {
    var IDBKeyRange = _a.IDBKeyRange; _a.indexedDB;
    var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
    return {
        dbcore: dbcore
    };
}
function generateMiddlewareStacks(_a, tmpTrans) {
    var db = _a._novip;
    var idbdb = tmpTrans.db;
    var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
    db.core = stacks.dbcore;
    db.tables.forEach(function (table) {
        var tableName = table.name;
        if (db.core.schema.tables.some(function (tbl) { return tbl.name === tableName; })) {
            table.core = db.core.table(tableName);
            if (db[tableName] instanceof db.Table) {
                db[tableName].core = table.core;
            }
        }
    });
}

function setApiOnPlace(_a, objs, tableNames, dbschema) {
    var db = _a._novip;
    tableNames.forEach(function (tableName) {
        var schema = dbschema[tableName];
        objs.forEach(function (obj) {
            var propDesc = getPropertyDescriptor(obj, tableName);
            if (!propDesc || ("value" in propDesc && propDesc.value === undefined)) {
                if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                    setProp(obj, tableName, {
                        get: function () { return this.table(tableName); },
                        set: function (value) {
                            defineProperty(this, tableName, { value: value, writable: true, configurable: true, enumerable: true });
                        }
                    });
                }
                else {
                    obj[tableName] = new db.Table(tableName, schema);
                }
            }
        });
    });
}
function removeTablesApi(_a, objs) {
    var db = _a._novip;
    objs.forEach(function (obj) {
        for (var key in obj) {
            if (obj[key] instanceof db.Table)
                delete obj[key];
        }
    });
}
function lowerVersionFirst(a, b) {
    return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
    var globalSchema = db._dbSchema;
    var trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
    trans.create(idbUpgradeTrans);
    trans._completion.catch(reject);
    var rejectTransaction = trans._reject.bind(trans);
    var transless = PSD.transless || PSD;
    newScope(function () {
        PSD.trans = trans;
        PSD.transless = transless;
        if (oldVersion === 0) {
            keys(globalSchema).forEach(function (tableName) {
                createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db, idbUpgradeTrans);
            DexiePromise.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
        }
        else
            updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
    });
}
function updateTablesAndIndexes(_a, oldVersion, trans, idbUpgradeTrans) {
    var db = _a._novip;
    var queue = [];
    var versions = db._versions;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    var anyContentUpgraderHasRun = false;
    var versToRun = versions.filter(function (v) { return v._cfg.version >= oldVersion; });
    versToRun.forEach(function (version) {
        queue.push(function () {
            var oldSchema = globalSchema;
            var newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
            globalSchema = db._dbSchema = newSchema;
            var diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(function (tuple) {
                createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(function (change) {
                if (change.recreate) {
                    throw new exceptions.Upgrade("Not yet support for changing primary key");
                }
                else {
                    var store_1 = idbUpgradeTrans.objectStore(change.name);
                    change.add.forEach(function (idx) { return addIndex(store_1, idx); });
                    change.change.forEach(function (idx) {
                        store_1.deleteIndex(idx.name);
                        addIndex(store_1, idx);
                    });
                    change.del.forEach(function (idxName) { return store_1.deleteIndex(idxName); });
                }
            });
            var contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
                generateMiddlewareStacks(db, idbUpgradeTrans);
                trans._memoizedTables = {};
                anyContentUpgraderHasRun = true;
                var upgradeSchema_1 = shallowClone(newSchema);
                diff.del.forEach(function (table) {
                    upgradeSchema_1[table] = oldSchema[table];
                });
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                trans.schema = upgradeSchema_1;
                var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
                if (contentUpgradeIsAsync_1) {
                    incrementExpectedAwaits();
                }
                var returnValue_1;
                var promiseFollowed = DexiePromise.follow(function () {
                    returnValue_1 = contentUpgrade(trans);
                    if (returnValue_1) {
                        if (contentUpgradeIsAsync_1) {
                            var decrementor = decrementExpectedAwaits.bind(null, null);
                            returnValue_1.then(decrementor, decrementor);
                        }
                    }
                });
                return (returnValue_1 && typeof returnValue_1.then === 'function' ?
                    DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function () { return returnValue_1; }));
            }
        });
        queue.push(function (idbtrans) {
            if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                var newSchema = version._cfg.dbschema;
                deleteRemovedTables(newSchema, idbtrans);
            }
            removeTablesApi(db, [db.Transaction.prototype]);
            setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
            trans.schema = db._dbSchema;
        });
    });
    function runQueue() {
        return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
            DexiePromise.resolve();
    }
    return runQueue().then(function () {
        createMissingTables(globalSchema, idbUpgradeTrans);
    });
}
function getSchemaDiff(oldSchema, newSchema) {
    var diff = {
        del: [],
        add: [],
        change: []
    };
    var table;
    for (table in oldSchema) {
        if (!newSchema[table])
            diff.del.push(table);
    }
    for (table in newSchema) {
        var oldDef = oldSchema[table], newDef = newSchema[table];
        if (!oldDef) {
            diff.add.push([table, newDef]);
        }
        else {
            var change = {
                name: table,
                def: newDef,
                recreate: false,
                del: [],
                add: [],
                change: []
            };
            if ((
            '' + (oldDef.primKey.keyPath || '')) !== ('' + (newDef.primKey.keyPath || '')) ||
                (oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge))
             {
                change.recreate = true;
                diff.change.push(change);
            }
            else {
                var oldIndexes = oldDef.idxByName;
                var newIndexes = newDef.idxByName;
                var idxName = void 0;
                for (idxName in oldIndexes) {
                    if (!newIndexes[idxName])
                        change.del.push(idxName);
                }
                for (idxName in newIndexes) {
                    var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                    if (!oldIdx)
                        change.add.push(newIdx);
                    else if (oldIdx.src !== newIdx.src)
                        change.change.push(newIdx);
                }
                if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                    diff.change.push(change);
                }
            }
        }
    }
    return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
    var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
        { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
        { autoIncrement: primKey.auto });
    indexes.forEach(function (idx) { return addIndex(store, idx); });
    return store;
}
function createMissingTables(newSchema, idbtrans) {
    keys(newSchema).forEach(function (tableName) {
        if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
        }
    });
}
function deleteRemovedTables(newSchema, idbtrans) {
    [].slice.call(idbtrans.db.objectStoreNames).forEach(function (storeName) {
        return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
    });
}
function addIndex(store, idx) {
    store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
    var globalSchema = {};
    var dbStoreNames = slice(idbdb.objectStoreNames, 0);
    dbStoreNames.forEach(function (storeName) {
        var store = tmpTrans.objectStore(storeName);
        var keyPath = store.keyPath;
        var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
        var indexes = [];
        for (var j = 0; j < store.indexNames.length; ++j) {
            var idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
        }
        globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
    });
    return globalSchema;
}
function readGlobalSchema(_a, idbdb, tmpTrans) {
    var db = _a._novip;
    db.verno = idbdb.version / 10;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
    db._storeNames = slice(idbdb.objectStoreNames, 0);
    setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
    var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
    var diff = getSchemaDiff(installedSchema, db._dbSchema);
    return !(diff.add.length || diff.change.some(function (ch) { return ch.add.length || ch.change.length; }));
}
function adjustToExistingIndexNames(_a, schema, idbtrans) {
    var db = _a._novip;
    var storeNames = idbtrans.db.objectStoreNames;
    for (var i = 0; i < storeNames.length; ++i) {
        var storeName = storeNames[i];
        var store = idbtrans.objectStore(storeName);
        db._hasGetAll = 'getAll' in store;
        for (var j = 0; j < store.indexNames.length; ++j) {
            var indexName = store.indexNames[j];
            var keyPath = store.index(indexName).keyPath;
            var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
            if (schema[storeName]) {
                var indexSpec = schema[storeName].idxByName[dexieName];
                if (indexSpec) {
                    indexSpec.name = indexName;
                    delete schema[storeName].idxByName[dexieName];
                    schema[storeName].idxByName[indexName] = indexSpec;
                }
            }
        }
    }
    if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
        _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
        db._hasGetAll = false;
    }
}
function parseIndexSyntax(primKeyAndIndexes) {
    return primKeyAndIndexes.split(',').map(function (index, indexNum) {
        index = index.trim();
        var name = index.replace(/([&*]|\+\+)/g, "");
        var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
        return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
    });
}

var Version =  (function () {
    function Version() {
    }
    Version.prototype._parseStoresSpec = function (stores, outSchema) {
        keys(stores).forEach(function (tableName) {
            if (stores[tableName] !== null) {
                var indexes = parseIndexSyntax(stores[tableName]);
                var primKey = indexes.shift();
                if (primKey.multi)
                    throw new exceptions.Schema("Primary key cannot be multi-valued");
                indexes.forEach(function (idx) {
                    if (idx.auto)
                        throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                    if (!idx.keyPath)
                        throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                });
                outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
            }
        });
    };
    Version.prototype.stores = function (stores) {
        var db = this.db;
        this._cfg.storesSource = this._cfg.storesSource ?
            extend(this._cfg.storesSource, stores) :
            stores;
        var versions = db._versions;
        var storesSpec = {};
        var dbschema = {};
        versions.forEach(function (version) {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = (version._cfg.dbschema = {});
            version._parseStoresSpec(storesSpec, dbschema);
        });
        db._dbSchema = dbschema;
        removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
        setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
        db._storeNames = keys(dbschema);
        return this;
    };
    Version.prototype.upgrade = function (upgradeFunction) {
        this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
        return this;
    };
    return Version;
}());

function createVersionConstructor(db) {
    return makeClassConstructor(Version.prototype, function Version(versionNumber) {
        this.db = db;
        this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
        };
    });
}

function getDbNamesTable(indexedDB, IDBKeyRange) {
    var dbNamesDB = indexedDB["_dbNamesDB"];
    if (!dbNamesDB) {
        dbNamesDB = indexedDB["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
            addons: [],
            indexedDB: indexedDB,
            IDBKeyRange: IDBKeyRange,
        });
        dbNamesDB.version(1).stores({ dbnames: "name" });
    }
    return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB) {
    return indexedDB && typeof indexedDB.databases === "function";
}
function getDatabaseNames(_a) {
    var indexedDB = _a.indexedDB, IDBKeyRange = _a.IDBKeyRange;
    return hasDatabasesNative(indexedDB)
        ? Promise.resolve(indexedDB.databases()).then(function (infos) {
            return infos
                .map(function (info) { return info.name; })
                .filter(function (name) { return name !== DBNAMES_DB; });
        })
        : getDbNamesTable(indexedDB, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated(_a, name) {
    var indexedDB = _a.indexedDB, IDBKeyRange = _a.IDBKeyRange;
    !hasDatabasesNative(indexedDB) &&
        name !== DBNAMES_DB &&
        getDbNamesTable(indexedDB, IDBKeyRange).put({ name: name }).catch(nop);
}
function _onDatabaseDeleted(_a, name) {
    var indexedDB = _a.indexedDB, IDBKeyRange = _a.IDBKeyRange;
    !hasDatabasesNative(indexedDB) &&
        name !== DBNAMES_DB &&
        getDbNamesTable(indexedDB, IDBKeyRange).delete(name).catch(nop);
}

function vip(fn) {
    return newScope(function () {
        PSD.letThrough = true;
        return fn();
    });
}

function idbReady() {
    var isSafari = !navigator.userAgentData &&
        /Safari\//.test(navigator.userAgent) &&
        !/Chrom(e|ium)\//.test(navigator.userAgent);
    if (!isSafari || !indexedDB.databases)
        return Promise.resolve();
    var intervalId;
    return new Promise(function (resolve) {
        var tryIdb = function () { return indexedDB.databases().finally(resolve); };
        intervalId = setInterval(tryIdb, 100);
        tryIdb();
    }).finally(function () { return clearInterval(intervalId); });
}

function dexieOpen(db) {
    var state = db._state;
    var indexedDB = db._deps.indexedDB;
    if (state.isBeingOpened || db.idbdb)
        return state.dbReadyPromise.then(function () { return state.dbOpenError ?
            rejection(state.dbOpenError) :
            db; });
    debug && (state.openCanceller._stackHolder = getErrorWithStack());
    state.isBeingOpened = true;
    state.dbOpenError = null;
    state.openComplete = false;
    var openCanceller = state.openCanceller;
    function throwIfCancelled() {
        if (state.openCanceller !== openCanceller)
            throw new exceptions.DatabaseClosed('db.open() was cancelled');
    }
    var resolveDbReady = state.dbReadyResolve,
    upgradeTransaction = null, wasCreated = false;
    return DexiePromise.race([openCanceller, (typeof navigator === 'undefined' ? DexiePromise.resolve() : idbReady()).then(function () { return new DexiePromise(function (resolve, reject) {
            throwIfCancelled();
            if (!indexedDB)
                throw new exceptions.MissingAPI();
            var dbName = db.name;
            var req = state.autoSchema ?
                indexedDB.open(dbName) :
                indexedDB.open(dbName, Math.round(db.verno * 10));
            if (!req)
                throw new exceptions.MissingAPI();
            req.onerror = eventRejectHandler(reject);
            req.onblocked = wrap(db._fireOnBlocked);
            req.onupgradeneeded = wrap(function (e) {
                upgradeTransaction = req.transaction;
                if (state.autoSchema && !db._options.allowEmptyDB) {
                    req.onerror = preventDefault;
                    upgradeTransaction.abort();
                    req.result.close();
                    var delreq = indexedDB.deleteDatabase(dbName);
                    delreq.onsuccess = delreq.onerror = wrap(function () {
                        reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                    });
                }
                else {
                    upgradeTransaction.onerror = eventRejectHandler(reject);
                    var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                    wasCreated = oldVer < 1;
                    db._novip.idbdb = req.result;
                    runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                }
            }, reject);
            req.onsuccess = wrap(function () {
                upgradeTransaction = null;
                var idbdb = db._novip.idbdb = req.result;
                var objectStoreNames = slice(idbdb.objectStoreNames);
                if (objectStoreNames.length > 0)
                    try {
                        var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                        if (state.autoSchema)
                            readGlobalSchema(db, idbdb, tmpTrans);
                        else {
                            adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                            if (!verifyInstalledSchema(db, tmpTrans)) {
                                console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.");
                            }
                        }
                        generateMiddlewareStacks(db, tmpTrans);
                    }
                    catch (e) {
                    }
                connections.push(db);
                idbdb.onversionchange = wrap(function (ev) {
                    state.vcFired = true;
                    db.on("versionchange").fire(ev);
                });
                idbdb.onclose = wrap(function (ev) {
                    db.on("close").fire(ev);
                });
                if (wasCreated)
                    _onDatabaseCreated(db._deps, dbName);
                resolve();
            }, reject);
        }); })]).then(function () {
        throwIfCancelled();
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(function () { return db.on.ready.fire(db.vip); })).then(function fireRemainders() {
            if (state.onReadyBeingFired.length > 0) {
                var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
                state.onReadyBeingFired = [];
                return DexiePromise.resolve(vip(function () { return remainders_1(db.vip); })).then(fireRemainders);
            }
        });
    }).finally(function () {
        state.onReadyBeingFired = null;
        state.isBeingOpened = false;
    }).then(function () {
        return db;
    }).catch(function (err) {
        state.dbOpenError = err;
        try {
            upgradeTransaction && upgradeTransaction.abort();
        }
        catch (_a) { }
        if (openCanceller === state.openCanceller) {
            db._close();
        }
        return rejection(err);
    }).finally(function () {
        state.openComplete = true;
        resolveDbReady();
    });
}

function awaitIterator(iterator) {
    var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
        return function (val) {
            var next = getNext(val), value = next.value;
            return next.done ? value :
                (!value || typeof value.then !== 'function' ?
                    isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                    value.then(onSuccess, onError));
        };
    }
    return step(callNext)();
}

function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
    var i = arguments.length;
    if (i < 2)
        throw new exceptions.InvalidArgument("Too few arguments");
    var args = new Array(i - 1);
    while (--i)
        args[i - 1] = arguments[i];
    scopeFunc = args.pop();
    var tables = flatten(args);
    return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
    return DexiePromise.resolve().then(function () {
        var transless = PSD.transless || PSD;
        var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
        var zoneProps = {
            trans: trans,
            transless: transless
        };
        if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
        }
        else {
            try {
                trans.create();
                db._state.PR1398_maxLoop = 3;
            }
            catch (ex) {
                if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                    console.warn('Dexie: Need to reopen db');
                    db._close();
                    return db.open().then(function () { return enterTransactionScope(db, mode, storeNames, null, scopeFunc); });
                }
                return rejection(ex);
            }
        }
        var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
        if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
        }
        var returnValue;
        var promiseFollowed = DexiePromise.follow(function () {
            returnValue = scopeFunc.call(trans, trans);
            if (returnValue) {
                if (scopeFuncIsAsync) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue.then(decrementor, decrementor);
                }
                else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                    returnValue = awaitIterator(returnValue);
                }
            }
        }, zoneProps);
        return (returnValue && typeof returnValue.then === 'function' ?
            DexiePromise.resolve(returnValue).then(function (x) { return trans.active ?
                x
                : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
            : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
            if (parentTransaction)
                trans._resolve();
            return trans._completion.then(function () { return x; });
        }).catch(function (e) {
            trans._reject(e);
            return rejection(e);
        });
    });
}

function pad(a, value, count) {
    var result = isArray(a) ? a.slice() : [a];
    for (var i = 0; i < count; ++i)
        result.push(value);
    return result;
}
function createVirtualIndexMiddleware(down) {
    return __assign(__assign({}, down), { table: function (tableName) {
            var table = down.table(tableName);
            var schema = table.schema;
            var indexLookup = {};
            var allVirtualIndexes = [];
            function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                var keyPathAlias = getKeyPathAlias(keyPath);
                var indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                var keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                var isVirtual = keyTail > 0;
                var virtualIndex = __assign(__assign({}, lowLevelIndex), { isVirtual: isVirtual, keyTail: keyTail, keyLength: keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
                indexList.push(virtualIndex);
                if (!virtualIndex.isPrimaryKey) {
                    allVirtualIndexes.push(virtualIndex);
                }
                if (keyLength > 1) {
                    var virtualKeyPath = keyLength === 2 ?
                        keyPath[0] :
                        keyPath.slice(0, keyLength - 1);
                    addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                }
                indexList.sort(function (a, b) { return a.keyTail - b.keyTail; });
                return virtualIndex;
            }
            var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
            indexLookup[":id"] = [primaryKey];
            for (var _i = 0, _a = schema.indexes; _i < _a.length; _i++) {
                var index = _a[_i];
                addVirtualIndexes(index.keyPath, 0, index);
            }
            function findBestIndex(keyPath) {
                var result = indexLookup[getKeyPathAlias(keyPath)];
                return result && result[0];
            }
            function translateRange(range, keyTail) {
                return {
                    type: range.type === 1  ?
                        2  :
                        range.type,
                    lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                    lowerOpen: true,
                    upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                    upperOpen: true
                };
            }
            function translateRequest(req) {
                var index = req.query.index;
                return index.isVirtual ? __assign(__assign({}, req), { query: {
                        index: index,
                        range: translateRange(req.query.range, index.keyTail)
                    } }) : req;
            }
            var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey: primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function (req) {
                    return table.count(translateRequest(req));
                }, query: function (req) {
                    return table.query(translateRequest(req));
                }, openCursor: function (req) {
                    var _a = req.query.index, keyTail = _a.keyTail, isVirtual = _a.isVirtual, keyLength = _a.keyLength;
                    if (!isVirtual)
                        return table.openCursor(req);
                    function createVirtualCursor(cursor) {
                        function _continue(key) {
                            key != null ?
                                cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                req.unique ?
                                    cursor.continue(cursor.key.slice(0, keyLength)
                                        .concat(req.reverse
                                        ? down.MIN_KEY
                                        : down.MAX_KEY, keyTail)) :
                                    cursor.continue();
                        }
                        var virtualCursor = Object.create(cursor, {
                            continue: { value: _continue },
                            continuePrimaryKey: {
                                value: function (key, primaryKey) {
                                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                }
                            },
                            primaryKey: {
                                get: function () {
                                    return cursor.primaryKey;
                                }
                            },
                            key: {
                                get: function () {
                                    var key = cursor.key;
                                    return keyLength === 1 ?
                                        key[0] :
                                        key.slice(0, keyLength);
                                }
                            },
                            value: {
                                get: function () {
                                    return cursor.value;
                                }
                            }
                        });
                        return virtualCursor;
                    }
                    return table.openCursor(translateRequest(req))
                        .then(function (cursor) { return cursor && createVirtualCursor(cursor); });
                } });
            return result;
        } });
}
var virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware
};

function getObjectDiff(a, b, rv, prfx) {
    rv = rv || {};
    prfx = prfx || '';
    keys(a).forEach(function (prop) {
        if (!hasOwn(b, prop)) {
            rv[prfx + prop] = undefined;
        }
        else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                var apTypeName = toStringTag(ap);
                var bpTypeName = toStringTag(bp);
                if (apTypeName !== bpTypeName) {
                    rv[prfx + prop] = b[prop];
                }
                else if (apTypeName === 'Object') {
                    getObjectDiff(ap, bp, rv, prfx + prop + '.');
                }
                else if (ap !== bp) {
                    rv[prfx + prop] = b[prop];
                }
            }
            else if (ap !== bp)
                rv[prfx + prop] = b[prop];
        }
    });
    keys(b).forEach(function (prop) {
        if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop];
        }
    });
    return rv;
}

function getEffectiveKeys(primaryKey, req) {
    if (req.type === 'delete')
        return req.keys;
    return req.keys || req.values.map(primaryKey.extractKey);
}

var hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: function (downCore) { return (__assign(__assign({}, downCore), { table: function (tableName) {
            var downTable = downCore.table(tableName);
            var primaryKey = downTable.schema.primaryKey;
            var tableMiddleware = __assign(__assign({}, downTable), { mutate: function (req) {
                    var dxTrans = PSD.trans;
                    var _a = dxTrans.table(tableName).hook, deleting = _a.deleting, creating = _a.creating, updating = _a.updating;
                    switch (req.type) {
                        case 'add':
                            if (creating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'put':
                            if (creating.fire === nop && updating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'delete':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'deleteRange':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return deleteRange(req); }, true);
                    }
                    return downTable.mutate(req);
                    function addPutOrDelete(req) {
                        var dxTrans = PSD.trans;
                        var keys = req.keys || getEffectiveKeys(primaryKey, req);
                        if (!keys)
                            throw new Error("Keys missing");
                        req = req.type === 'add' || req.type === 'put' ? __assign(__assign({}, req), { keys: keys }) : __assign({}, req);
                        if (req.type !== 'delete')
                            req.values = __spreadArray([], req.values, true);
                        if (req.keys)
                            req.keys = __spreadArray([], req.keys, true);
                        return getExistingValues(downTable, req, keys).then(function (existingValues) {
                            var contexts = keys.map(function (key, i) {
                                var existingValue = existingValues[i];
                                var ctx = { onerror: null, onsuccess: null };
                                if (req.type === 'delete') {
                                    deleting.fire.call(ctx, key, existingValue, dxTrans);
                                }
                                else if (req.type === 'add' || existingValue === undefined) {
                                    var generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                    if (key == null && generatedPrimaryKey != null) {
                                        key = generatedPrimaryKey;
                                        req.keys[i] = key;
                                        if (!primaryKey.outbound) {
                                            setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                        }
                                    }
                                }
                                else {
                                    var objectDiff = getObjectDiff(existingValue, req.values[i]);
                                    var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                    if (additionalChanges_1) {
                                        var requestedValue_1 = req.values[i];
                                        Object.keys(additionalChanges_1).forEach(function (keyPath) {
                                            if (hasOwn(requestedValue_1, keyPath)) {
                                                requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                                            }
                                            else {
                                                setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                                            }
                                        });
                                    }
                                }
                                return ctx;
                            });
                            return downTable.mutate(req).then(function (_a) {
                                var failures = _a.failures, results = _a.results, numFailures = _a.numFailures, lastResult = _a.lastResult;
                                for (var i = 0; i < keys.length; ++i) {
                                    var primKey = results ? results[i] : keys[i];
                                    var ctx = contexts[i];
                                    if (primKey == null) {
                                        ctx.onerror && ctx.onerror(failures[i]);
                                    }
                                    else {
                                        ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                            req.values[i] :
                                            primKey
                                        );
                                    }
                                }
                                return { failures: failures, results: results, numFailures: numFailures, lastResult: lastResult };
                            }).catch(function (error) {
                                contexts.forEach(function (ctx) { return ctx.onerror && ctx.onerror(error); });
                                return Promise.reject(error);
                            });
                        });
                    }
                    function deleteRange(req) {
                        return deleteNextChunk(req.trans, req.range, 10000);
                    }
                    function deleteNextChunk(trans, range, limit) {
                        return downTable.query({ trans: trans, values: false, query: { index: primaryKey, range: range }, limit: limit })
                            .then(function (_a) {
                            var result = _a.result;
                            return addPutOrDelete({ type: 'delete', keys: result, trans: trans }).then(function (res) {
                                if (res.numFailures > 0)
                                    return Promise.reject(res.failures[0]);
                                if (result.length < limit) {
                                    return { failures: [], numFailures: 0, lastResult: undefined };
                                }
                                else {
                                    return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                                }
                            });
                        });
                    }
                } });
            return tableMiddleware;
        } })); }
};
function getExistingValues(table, req, effectiveKeys) {
    return req.type === "add"
        ? Promise.resolve([])
        : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
}

function getFromTransactionCache(keys, cache, clone) {
    try {
        if (!cache)
            return null;
        if (cache.keys.length < keys.length)
            return null;
        var result = [];
        for (var i = 0, j = 0; i < cache.keys.length && j < keys.length; ++i) {
            if (cmp(cache.keys[i], keys[j]) !== 0)
                continue;
            result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
            ++j;
        }
        return result.length === keys.length ? result : null;
    }
    catch (_a) {
        return null;
    }
}
var cacheExistingValuesMiddleware = {
    stack: "dbcore",
    level: -1,
    create: function (core) {
        return {
            table: function (tableName) {
                var table = core.table(tableName);
                return __assign(__assign({}, table), { getMany: function (req) {
                        if (!req.cache) {
                            return table.getMany(req);
                        }
                        var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                        if (cachedResult) {
                            return DexiePromise.resolve(cachedResult);
                        }
                        return table.getMany(req).then(function (res) {
                            req.trans["_cache"] = {
                                keys: req.keys,
                                values: req.cache === "clone" ? deepClone(res) : res,
                            };
                            return res;
                        });
                    }, mutate: function (req) {
                        if (req.type !== "add")
                            req.trans["_cache"] = null;
                        return table.mutate(req);
                    } });
            },
        };
    },
};

var _a;
function isEmptyRange(node) {
    return !("from" in node);
}
var RangeSet = function (fromOrTree, to) {
    if (this) {
        extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
    }
    else {
        var rv = new RangeSet();
        if (fromOrTree && ("d" in fromOrTree)) {
            extend(rv, fromOrTree);
        }
        return rv;
    }
};
props(RangeSet.prototype, (_a = {
        add: function (rangeSet) {
            mergeRanges(this, rangeSet);
            return this;
        },
        addKey: function (key) {
            addRange(this, key, key);
            return this;
        },
        addKeys: function (keys) {
            var _this = this;
            keys.forEach(function (key) { return addRange(_this, key, key); });
            return this;
        }
    },
    _a[iteratorSymbol] = function () {
        return getRangeSetIterator(this);
    },
    _a));
function addRange(target, from, to) {
    var diff = cmp(from, to);
    if (isNaN(diff))
        return;
    if (diff > 0)
        throw RangeError();
    if (isEmptyRange(target))
        return extend(target, { from: from, to: to, d: 1 });
    var left = target.l;
    var right = target.r;
    if (cmp(to, target.from) < 0) {
        left
            ? addRange(left, from, to)
            : (target.l = { from: from, to: to, d: 1, l: null, r: null });
        return rebalance(target);
    }
    if (cmp(from, target.to) > 0) {
        right
            ? addRange(right, from, to)
            : (target.r = { from: from, to: to, d: 1, l: null, r: null });
        return rebalance(target);
    }
    if (cmp(from, target.from) < 0) {
        target.from = from;
        target.l = null;
        target.d = right ? right.d + 1 : 1;
    }
    if (cmp(to, target.to) > 0) {
        target.to = to;
        target.r = null;
        target.d = target.l ? target.l.d + 1 : 1;
    }
    var rightWasCutOff = !target.r;
    if (left && !target.l) {
        mergeRanges(target, left);
    }
    if (right && rightWasCutOff) {
        mergeRanges(target, right);
    }
}
function mergeRanges(target, newSet) {
    function _addRangeSet(target, _a) {
        var from = _a.from, to = _a.to, l = _a.l, r = _a.r;
        addRange(target, from, to);
        if (l)
            _addRangeSet(target, l);
        if (r)
            _addRangeSet(target, r);
    }
    if (!isEmptyRange(newSet))
        _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
    var i1 = getRangeSetIterator(rangeSet2);
    var nextResult1 = i1.next();
    if (nextResult1.done)
        return false;
    var a = nextResult1.value;
    var i2 = getRangeSetIterator(rangeSet1);
    var nextResult2 = i2.next(a.from);
    var b = nextResult2.value;
    while (!nextResult1.done && !nextResult2.done) {
        if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
            return true;
        cmp(a.from, b.from) < 0
            ? (a = (nextResult1 = i1.next(b.from)).value)
            : (b = (nextResult2 = i2.next(a.from)).value);
    }
    return false;
}
function getRangeSetIterator(node) {
    var state = isEmptyRange(node) ? null : { s: 0, n: node };
    return {
        next: function (key) {
            var keyProvided = arguments.length > 0;
            while (state) {
                switch (state.s) {
                    case 0:
                        state.s = 1;
                        if (keyProvided) {
                            while (state.n.l && cmp(key, state.n.from) < 0)
                                state = { up: state, n: state.n.l, s: 1 };
                        }
                        else {
                            while (state.n.l)
                                state = { up: state, n: state.n.l, s: 1 };
                        }
                    case 1:
                        state.s = 2;
                        if (!keyProvided || cmp(key, state.n.to) <= 0)
                            return { value: state.n, done: false };
                    case 2:
                        if (state.n.r) {
                            state.s = 3;
                            state = { up: state, n: state.n.r, s: 0 };
                            continue;
                        }
                    case 3:
                        state = state.up;
                }
            }
            return { done: true };
        },
    };
}
function rebalance(target) {
    var _a, _b;
    var diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
    var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
    if (r) {
        var l = r === "r" ? "l" : "r";
        var rootClone = __assign({}, target);
        var oldRootRight = target[r];
        target.from = oldRootRight.from;
        target.to = oldRootRight.to;
        target[r] = oldRootRight[r];
        rootClone[r] = oldRootRight[l];
        target[l] = rootClone;
        rootClone.d = computeDepth(rootClone);
    }
    target.d = computeDepth(target);
}
function computeDepth(_a) {
    var r = _a.r, l = _a.l;
    return (r ? (l ? Math.max(r.d, l.d) : r.d) : l ? l.d : 0) + 1;
}

var observabilityMiddleware = {
    stack: "dbcore",
    level: 0,
    create: function (core) {
        var dbName = core.schema.name;
        var FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
        return __assign(__assign({}, core), { table: function (tableName) {
                var table = core.table(tableName);
                var schema = table.schema;
                var primaryKey = schema.primaryKey;
                var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
                var tableClone = __assign(__assign({}, table), { mutate: function (req) {
                        var trans = req.trans;
                        var mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
                        var getRangeSet = function (indexName) {
                            var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
                            return (mutatedParts[part] ||
                                (mutatedParts[part] = new RangeSet()));
                        };
                        var pkRangeSet = getRangeSet("");
                        var delsRangeSet = getRangeSet(":dels");
                        var type = req.type;
                        var _a = req.type === "deleteRange"
                            ? [req.range]
                            : req.type === "delete"
                                ? [req.keys]
                                : req.values.length < 50
                                    ? [[], req.values]
                                    : [], keys = _a[0], newObjs = _a[1];
                        var oldCache = req.trans["_cache"];
                        return table.mutate(req).then(function (res) {
                            if (isArray(keys)) {
                                if (type !== "delete")
                                    keys = res.results;
                                pkRangeSet.addKeys(keys);
                                var oldObjs = getFromTransactionCache(keys, oldCache);
                                if (!oldObjs && type !== "add") {
                                    delsRangeSet.addKeys(keys);
                                }
                                if (oldObjs || newObjs) {
                                    trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                                }
                            }
                            else if (keys) {
                                var range = { from: keys.lower, to: keys.upper };
                                delsRangeSet.add(range);
                                pkRangeSet.add(range);
                            }
                            else {
                                pkRangeSet.add(FULL_RANGE);
                                delsRangeSet.add(FULL_RANGE);
                                schema.indexes.forEach(function (idx) { return getRangeSet(idx.name).add(FULL_RANGE); });
                            }
                            return res;
                        });
                    } });
                var getRange = function (_a) {
                    var _b, _c;
                    var _d = _a.query, index = _d.index, range = _d.range;
                    return [
                        index,
                        new RangeSet((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY),
                    ];
                };
                var readSubscribers = {
                    get: function (req) { return [primaryKey, new RangeSet(req.key)]; },
                    getMany: function (req) { return [primaryKey, new RangeSet().addKeys(req.keys)]; },
                    count: getRange,
                    query: getRange,
                    openCursor: getRange,
                };
                keys(readSubscribers).forEach(function (method) {
                    tableClone[method] = function (req) {
                        var subscr = PSD.subscr;
                        if (subscr) {
                            var getRangeSet = function (indexName) {
                                var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
                                return (subscr[part] ||
                                    (subscr[part] = new RangeSet()));
                            };
                            var pkRangeSet_1 = getRangeSet("");
                            var delsRangeSet_1 = getRangeSet(":dels");
                            var _a = readSubscribers[method](req), queriedIndex = _a[0], queriedRanges = _a[1];
                            getRangeSet(queriedIndex.name || "").add(queriedRanges);
                            if (!queriedIndex.isPrimaryKey) {
                                if (method === "count") {
                                    delsRangeSet_1.add(FULL_RANGE);
                                }
                                else {
                                    var keysPromise_1 = method === "query" &&
                                        outbound &&
                                        req.values &&
                                        table.query(__assign(__assign({}, req), { values: false }));
                                    return table[method].apply(this, arguments).then(function (res) {
                                        if (method === "query") {
                                            if (outbound && req.values) {
                                                return keysPromise_1.then(function (_a) {
                                                    var resultingKeys = _a.result;
                                                    pkRangeSet_1.addKeys(resultingKeys);
                                                    return res;
                                                });
                                            }
                                            var pKeys = req.values
                                                ? res.result.map(extractKey)
                                                : res.result;
                                            if (req.values) {
                                                pkRangeSet_1.addKeys(pKeys);
                                            }
                                            else {
                                                delsRangeSet_1.addKeys(pKeys);
                                            }
                                        }
                                        else if (method === "openCursor") {
                                            var cursor_1 = res;
                                            var wantValues_1 = req.values;
                                            return (cursor_1 &&
                                                Object.create(cursor_1, {
                                                    key: {
                                                        get: function () {
                                                            delsRangeSet_1.addKey(cursor_1.primaryKey);
                                                            return cursor_1.key;
                                                        },
                                                    },
                                                    primaryKey: {
                                                        get: function () {
                                                            var pkey = cursor_1.primaryKey;
                                                            delsRangeSet_1.addKey(pkey);
                                                            return pkey;
                                                        },
                                                    },
                                                    value: {
                                                        get: function () {
                                                            wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                                            return cursor_1.value;
                                                        },
                                                    },
                                                }));
                                        }
                                        return res;
                                    });
                                }
                            }
                        }
                        return table[method].apply(this, arguments);
                    };
                });
                return tableClone;
            } });
    },
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
    function addAffectedIndex(ix) {
        var rangeSet = getRangeSet(ix.name || "");
        function extractKey(obj) {
            return obj != null ? ix.extractKey(obj) : null;
        }
        var addKeyOrKeys = function (key) { return ix.multiEntry && isArray(key)
            ? key.forEach(function (key) { return rangeSet.addKey(key); })
            : rangeSet.addKey(key); };
        (oldObjs || newObjs).forEach(function (_, i) {
            var oldKey = oldObjs && extractKey(oldObjs[i]);
            var newKey = newObjs && extractKey(newObjs[i]);
            if (cmp(oldKey, newKey) !== 0) {
                if (oldKey != null)
                    addKeyOrKeys(oldKey);
                if (newKey != null)
                    addKeyOrKeys(newKey);
            }
        });
    }
    schema.indexes.forEach(addAffectedIndex);
}

var Dexie$1 =  (function () {
    function Dexie(name, options) {
        var _this = this;
        this._middlewares = {};
        this.verno = 0;
        var deps = Dexie.dependencies;
        this._options = options = __assign({
            addons: Dexie.addons, autoOpen: true,
            indexedDB: deps.indexedDB, IDBKeyRange: deps.IDBKeyRange }, options);
        this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
        };
        var addons = options.addons;
        this._dbSchema = {};
        this._versions = [];
        this._storeNames = [];
        this._allTables = {};
        this.idbdb = null;
        this._novip = this;
        var state = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true,
            PR1398_maxLoop: 3
        };
        state.dbReadyPromise = new DexiePromise(function (resolve) {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise(function (_, reject) {
            state.cancelOpen = reject;
        });
        this._state = state;
        this.name = name;
        this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
        this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
            return function (subscriber, bSticky) {
                Dexie.vip(function () {
                    var state = _this._state;
                    if (state.openComplete) {
                        if (!state.dbOpenError)
                            DexiePromise.resolve().then(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else if (state.onReadyBeingFired) {
                        state.onReadyBeingFired.push(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else {
                        subscribe(subscriber);
                        var db_1 = _this;
                        if (!bSticky)
                            subscribe(function unsubscribe() {
                                db_1.on.ready.unsubscribe(subscriber);
                                db_1.on.ready.unsubscribe(unsubscribe);
                            });
                    }
                });
            };
        });
        this.Collection = createCollectionConstructor(this);
        this.Table = createTableConstructor(this);
        this.Transaction = createTransactionConstructor(this);
        this.Version = createVersionConstructor(this);
        this.WhereClause = createWhereClauseConstructor(this);
        this.on("versionchange", function (ev) {
            if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
            else
                console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
            _this.close();
        });
        this.on("blocked", function (ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('" + _this.name + "') was blocked");
            else
                console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
        });
        this._maxKey = getMaxKey(options.IDBKeyRange);
        this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) { return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction); };
        this._fireOnBlocked = function (ev) {
            _this.on("blocked").fire(ev);
            connections
                .filter(function (c) { return c.name === _this.name && c !== _this && !c._state.vcFired; })
                .map(function (c) { return c.on("versionchange").fire(ev); });
        };
        this.use(virtualIndexMiddleware);
        this.use(hooksMiddleware);
        this.use(observabilityMiddleware);
        this.use(cacheExistingValuesMiddleware);
        this.vip = Object.create(this, { _vip: { value: true } });
        addons.forEach(function (addon) { return addon(_this); });
    }
    Dexie.prototype.version = function (versionNumber) {
        if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
        versionNumber = Math.round(versionNumber * 10) / 10;
        if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, versionNumber);
        var versions = this._versions;
        var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
        if (versionInstance)
            return versionInstance;
        versionInstance = new this.Version(versionNumber);
        versions.push(versionInstance);
        versions.sort(lowerVersionFirst);
        versionInstance.stores({});
        this._state.autoSchema = false;
        return versionInstance;
    };
    Dexie.prototype._whenReady = function (fn) {
        var _this = this;
        return (this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip)) ? fn() : new DexiePromise(function (resolve, reject) {
            if (_this._state.openComplete) {
                return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
            }
            if (!_this._state.isBeingOpened) {
                if (!_this._options.autoOpen) {
                    reject(new exceptions.DatabaseClosed());
                    return;
                }
                _this.open().catch(nop);
            }
            _this._state.dbReadyPromise.then(resolve, reject);
        }).then(fn);
    };
    Dexie.prototype.use = function (_a) {
        var stack = _a.stack, create = _a.create, level = _a.level, name = _a.name;
        if (name)
            this.unuse({ stack: stack, name: name });
        var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
        middlewares.push({ stack: stack, create: create, level: level == null ? 10 : level, name: name });
        middlewares.sort(function (a, b) { return a.level - b.level; });
        return this;
    };
    Dexie.prototype.unuse = function (_a) {
        var stack = _a.stack, name = _a.name, create = _a.create;
        if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(function (mw) {
                return create ? mw.create !== create :
                    name ? mw.name !== name :
                        false;
            });
        }
        return this;
    };
    Dexie.prototype.open = function () {
        return dexieOpen(this);
    };
    Dexie.prototype._close = function () {
        var state = this._state;
        var idx = connections.indexOf(this);
        if (idx >= 0)
            connections.splice(idx, 1);
        if (this.idbdb) {
            try {
                this.idbdb.close();
            }
            catch (e) { }
            this._novip.idbdb = null;
        }
        state.dbReadyPromise = new DexiePromise(function (resolve) {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise(function (_, reject) {
            state.cancelOpen = reject;
        });
    };
    Dexie.prototype.close = function () {
        this._close();
        var state = this._state;
        this._options.autoOpen = false;
        state.dbOpenError = new exceptions.DatabaseClosed();
        if (state.isBeingOpened)
            state.cancelOpen(state.dbOpenError);
    };
    Dexie.prototype.delete = function () {
        var _this = this;
        var hasArguments = arguments.length > 0;
        var state = this._state;
        return new DexiePromise(function (resolve, reject) {
            var doDelete = function () {
                _this.close();
                var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                req.onsuccess = wrap(function () {
                    _onDatabaseDeleted(_this._deps, _this.name);
                    resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = _this._fireOnBlocked;
            };
            if (hasArguments)
                throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
            if (state.isBeingOpened) {
                state.dbReadyPromise.then(doDelete);
            }
            else {
                doDelete();
            }
        });
    };
    Dexie.prototype.backendDB = function () {
        return this.idbdb;
    };
    Dexie.prototype.isOpen = function () {
        return this.idbdb !== null;
    };
    Dexie.prototype.hasBeenClosed = function () {
        var dbOpenError = this._state.dbOpenError;
        return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
    };
    Dexie.prototype.hasFailed = function () {
        return this._state.dbOpenError !== null;
    };
    Dexie.prototype.dynamicallyOpened = function () {
        return this._state.autoSchema;
    };
    Object.defineProperty(Dexie.prototype, "tables", {
        get: function () {
            var _this = this;
            return keys(this._allTables).map(function (name) { return _this._allTables[name]; });
        },
        enumerable: false,
        configurable: true
    });
    Dexie.prototype.transaction = function () {
        var args = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, args);
    };
    Dexie.prototype._transaction = function (mode, tables, scopeFunc) {
        var _this = this;
        var parentTransaction = PSD.trans;
        if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
            parentTransaction = null;
        var onlyIfCompatible = mode.indexOf('?') !== -1;
        mode = mode.replace('!', '').replace('?', '');
        var idbMode, storeNames;
        try {
            storeNames = tables.map(function (table) {
                var storeName = table instanceof _this.Table ? table.name : table;
                if (typeof storeName !== 'string')
                    throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
            });
            if (mode == "r" || mode === READONLY)
                idbMode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
                idbMode = READWRITE;
            else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
                if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                    if (onlyIfCompatible) {
                        parentTransaction = null;
                    }
                    else
                        throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                    storeNames.forEach(function (storeName) {
                        if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                            if (onlyIfCompatible) {
                                parentTransaction = null;
                            }
                            else
                                throw new exceptions.SubTransaction("Table " + storeName +
                                    " not included in parent transaction.");
                        }
                    });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                    parentTransaction = null;
                }
            }
        }
        catch (e) {
            return parentTransaction ?
                parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                rejection(e);
        }
        var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
        return (parentTransaction ?
            parentTransaction._promise(idbMode, enterTransaction, "lock") :
            PSD.trans ?
                usePSD(PSD.transless, function () { return _this._whenReady(enterTransaction); }) :
                this._whenReady(enterTransaction));
    };
    Dexie.prototype.table = function (tableName) {
        if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
        }
        return this._allTables[tableName];
    };
    return Dexie;
}());

var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol
    ? Symbol.observable
    : "@@observable";
var Observable =  (function () {
    function Observable(subscribe) {
        this._subscribe = subscribe;
    }
    Observable.prototype.subscribe = function (x, error, complete) {
        return this._subscribe(!x || typeof x === "function" ? { next: x, error: error, complete: complete } : x);
    };
    Observable.prototype[symbolObservable] = function () {
        return this;
    };
    return Observable;
}());

function extendObservabilitySet(target, newSet) {
    keys(newSet).forEach(function (part) {
        var rangeSet = target[part] || (target[part] = new RangeSet());
        mergeRanges(rangeSet, newSet[part]);
    });
    return target;
}

function liveQuery(querier) {
    return new Observable(function (observer) {
        var scopeFuncIsAsync = isAsyncFunction(querier);
        function execute(subscr) {
            if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
            }
            var exec = function () { return newScope(querier, { subscr: subscr, trans: null }); };
            var rv = PSD.trans
                ?
                    usePSD(PSD.transless, exec)
                : exec();
            if (scopeFuncIsAsync) {
                rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
            }
            return rv;
        }
        var closed = false;
        var accumMuts = {};
        var currentObs = {};
        var subscription = {
            get closed() {
                return closed;
            },
            unsubscribe: function () {
                closed = true;
                globalEvents.storagemutated.unsubscribe(mutationListener);
            },
        };
        observer.start && observer.start(subscription);
        var querying = false, startedListening = false;
        function shouldNotify() {
            return keys(currentObs).some(function (key) {
                return accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]);
            });
        }
        var mutationListener = function (parts) {
            extendObservabilitySet(accumMuts, parts);
            if (shouldNotify()) {
                doQuery();
            }
        };
        var doQuery = function () {
            if (querying || closed)
                return;
            accumMuts = {};
            var subscr = {};
            var ret = execute(subscr);
            if (!startedListening) {
                globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                startedListening = true;
            }
            querying = true;
            Promise.resolve(ret).then(function (result) {
                querying = false;
                if (closed)
                    return;
                if (shouldNotify()) {
                    doQuery();
                }
                else {
                    accumMuts = {};
                    currentObs = subscr;
                    observer.next && observer.next(result);
                }
            }, function (err) {
                querying = false;
                observer.error && observer.error(err);
                subscription.unsubscribe();
            });
        };
        doQuery();
        return subscription;
    });
}

var domDeps;
try {
    domDeps = {
        indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
        IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
    };
}
catch (e) {
    domDeps = { indexedDB: null, IDBKeyRange: null };
}

var Dexie = Dexie$1;
props(Dexie, __assign(__assign({}, fullNameExceptions), {
    delete: function (databaseName) {
        var db = new Dexie(databaseName, { addons: [] });
        return db.delete();
    },
    exists: function (name) {
        return new Dexie(name, { addons: [] }).open().then(function (db) {
            db.close();
            return true;
        }).catch('NoSuchDatabaseError', function () { return false; });
    },
    getDatabaseNames: function (cb) {
        try {
            return getDatabaseNames(Dexie.dependencies).then(cb);
        }
        catch (_a) {
            return rejection(new exceptions.MissingAPI());
        }
    },
    defineClass: function () {
        function Class(content) {
            extend(this, content);
        }
        return Class;
    }, ignoreTransaction: function (scopeFunc) {
        return PSD.trans ?
            usePSD(PSD.transless, scopeFunc) :
            scopeFunc();
    }, vip: vip, async: function (generatorFn) {
        return function () {
            try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        };
    }, spawn: function (generatorFn, args, thiz) {
        try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== 'function')
                return DexiePromise.resolve(rv);
            return rv;
        }
        catch (e) {
            return rejection(e);
        }
    },
    currentTransaction: {
        get: function () { return PSD.trans || null; }
    }, waitFor: function (promiseOrFunction, optionalTimeout) {
        var promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
            Dexie.ignoreTransaction(promiseOrFunction) :
            promiseOrFunction)
            .timeout(optionalTimeout || 60000);
        return PSD.trans ?
            PSD.trans.waitFor(promise) :
            promise;
    },
    Promise: DexiePromise,
    debug: {
        get: function () { return debug; },
        set: function (value) {
            setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
        }
    },
    derive: derive, extend: extend, props: props, override: override,
    Events: Events, on: globalEvents, liveQuery: liveQuery, extendObservabilitySet: extendObservabilitySet,
    getByKeyPath: getByKeyPath, setByKeyPath: setByKeyPath, delByKeyPath: delByKeyPath, shallowClone: shallowClone, deepClone: deepClone, getObjectDiff: getObjectDiff, cmp: cmp, asap: asap$1,
    minKey: minKey,
    addons: [],
    connections: connections,
    errnames: errnames,
    dependencies: domDeps,
    semVer: DEXIE_VERSION, version: DEXIE_VERSION.split('.')
        .map(function (n) { return parseInt(n); })
        .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }) }));
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);

if (typeof dispatchEvent !== 'undefined' && typeof addEventListener !== 'undefined') {
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function (updatedParts) {
        if (!propagatingLocally) {
            var event_1;
            if (isIEOrEdge) {
                event_1 = document.createEvent('CustomEvent');
                event_1.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
            }
            else {
                event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
                    detail: updatedParts
                });
            }
            propagatingLocally = true;
            dispatchEvent(event_1);
            propagatingLocally = false;
        }
    });
    addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function (_a) {
        var detail = _a.detail;
        if (!propagatingLocally) {
            propagateLocally(detail);
        }
    });
}
function propagateLocally(updateParts) {
    var wasMe = propagatingLocally;
    try {
        propagatingLocally = true;
        globalEvents.storagemutated.fire(updateParts);
    }
    finally {
        propagatingLocally = wasMe;
    }
}
var propagatingLocally = false;

if (typeof BroadcastChannel !== 'undefined') {
    var bc_1 = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function (changedParts) {
        if (!propagatingLocally) {
            bc_1.postMessage(changedParts);
        }
    });
    bc_1.onmessage = function (ev) {
        if (ev.data)
            propagateLocally(ev.data);
    };
}
else if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function (changedParts) {
        try {
            if (!propagatingLocally) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
                        trig: Math.random(),
                        changedParts: changedParts,
                    }));
                }
                if (typeof self['clients'] === 'object') {
                    __spreadArray([], self['clients'].matchAll({ includeUncontrolled: true }), true).forEach(function (client) {
                        return client.postMessage({
                            type: STORAGE_MUTATED_DOM_EVENT_NAME,
                            changedParts: changedParts,
                        });
                    });
                }
            }
        }
        catch (_a) { }
    });
    if (typeof addEventListener !== 'undefined') {
        addEventListener('storage', function (ev) {
            if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
                var data = JSON.parse(ev.newValue);
                if (data)
                    propagateLocally(data.changedParts);
            }
        });
    }
    var swContainer = self.document && navigator.serviceWorker;
    if (swContainer) {
        swContainer.addEventListener('message', propagateMessageLocally);
    }
}
function propagateMessageLocally(_a) {
    var data = _a.data;
    if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
        propagateLocally(data.changedParts);
    }
}

DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

class FinansoDb extends Dexie$1 {
  constructor() {
    super('finansoDb');
    this.version(1).stores({
      pouch: '&id,dateBegin,dateEnd,desc,name',
      category: 'id,catId,title,dateBegin,dateEnd',
      expense: '&id,catId,cost,dateBegin,dateEnd,desc,pouchId,state,time'
    });
  }

}
const databaseClient = new FinansoDb();

class DatabaseDataProvider {
  get client() {
    return this.databaseClient;
  }

  ok(result) {
    return {
      data: result,
      error: undefined
    };
  }

  error(result) {
    return {
      data: undefined,
      error: result
    };
  }

  constructor() {
    this.databaseClient = databaseClient;
  }

}

function asyncGeneratorStep$q(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$q(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$q(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$q(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$A = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let AppDataProvider = class AppDataProvider extends DatabaseDataProvider {
  defineCategories(categories) {
    var _this = this;

    return _asyncToGenerator$q(function* () {
      yield _this.client.category.clear();
      yield _this.client.category.bulkAdd(categories);
      return _this.ok(true);
    })();
  }

};
AppDataProvider = __decorate$A([DataProvider()], AppDataProvider);

function asyncGeneratorStep$p(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$p(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$p(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$p(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$z = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$m = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$m = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let AppAdapter = class AppAdapter {
  defineCategories(categories) {
    var _this = this;

    return _asyncToGenerator$p(function* () {
      try {
        const {
          error
        } = yield _this.appDataProvider.defineCategories(categories);
        if (error) return dist.Result.Err(new AppErrors.DefineCategoryResponse(error));
        return dist.Result.Ok(null);
      } catch (e) {
        return dist.Result.Err(new AppErrors.UnexpectedErrorDefineCategory(e));
      }
    })();
  }

  constructor(appDataProvider) {
    this.appDataProvider = appDataProvider;
  }

};
AppAdapter = __decorate$z([Adapter(), __param$m(0, Inject()), __metadata$m("design:type", Function), __metadata$m("design:paramtypes", [typeof AppDataProvider === "undefined" ? Object : AppDataProvider])], AppAdapter);

const categoriesDefaultEn = [{
  id: '5a29b6a142c84c408b60f441',
  title: 'Clothes, shoes',
  catId: null
}, {
  id: '5a29b6a142784f408c024722',
  title: 'accessories',
  catId: '5a29b6a142c84c408b60f441'
}, {
  id: '5a29b6a14208df40903de075',
  title: 'footwear',
  catId: '5a29b6a142c84c408b60f441'
}, {
  id: '5a29b6a142f7c940ae912738',
  title: 'clothes',
  catId: '5a29b6a142c84c408b60f441'
}, {
  id: '5a29b6a1420afd40b28f75ea',
  title: 'Food',
  catId: null
}, {
  id: '5a29b6a1426c004093476371',
  title: 'cafe/restaurant',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a142b30340b20e6839',
  title: 'snack',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a142d91440b2102cf3',
  title: 'shop',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a1426ad340a0c3576e',
  title: 'dinner',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a142ef4040992cbaca',
  title: 'Other',
  catId: null
}, {
  id: '5a29b6a142bd5b409db65b1d',
  title: 'help',
  catId: '5a29b6a142ef4040992cbaca'
}, {
  id: '5a29b6a142c5c3408618b78b',
  title: 'presents',
  catId: '5a29b6a142ef4040992cbaca'
}, {
  id: '5a29b6a142ab6040b0791598',
  title: 'not planned',
  catId: '5a29b6a142ef4040992cbaca'
}, {
  id: '5a29b6a142cd6740a567c3e2',
  title: 'Travels',
  catId: null
}, {
  id: '5a29b6a1420dc84090489cee',
  title: 'transport',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a142c81d40a2156380',
  title: 'souvenirs',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a14254cc409594e679',
  title: 'connection',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a14254cc409594e772',
  title: 'housing',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a142d35940913422c9',
  title: 'food',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a142d35940913421c9',
  title: 'other',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a1426c2640b230815c',
  title: 'Personal transport',
  catId: null
}, {
  id: '5a29b6a142970240b329d8e3',
  title: 'fuel',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a1424bdc40ad4221a1',
  title: 'repair',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142207340a47d4600',
  title: 'insurance',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142a61e4087159fa1',
  title: 'TI',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a14260924081070e6d',
  title: 'penalty',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142d27840b9aa932a',
  title: 'tax',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142006a40b7509318',
  title: 'parking',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a1424dad40a32d06bf',
  title: 'car wash',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142539c40b39d5ec6',
  title: 'Public transport',
  catId: null
}, {
  id: '5a29b6a142eed840a39539ec',
  title: 'taxi',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142b294409d8ac8d8',
  title: 'train',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a1428627408175ff12',
  title: 'airplane',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a1428627408175fa11',
  title: 'passing car',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142e708409984fde3',
  title: 'public',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142d95b40b0010f7f',
  title: 'ship',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142d994408e7c13dd',
  title: 'House',
  catId: null
}, {
  id: '5a29b6a142624940a849393e',
  title: 'household chemicals',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a14232d6409c91622c',
  title: 'furniture',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a142143d40bffb6df1',
  title: 'dishes',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a142f1a9408048a97b',
  title: 'repairs',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a142066f409f54f8c1',
  title: 'stationery\n',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a14218fc4086045f3a',
  title: 'Accounts and Services',
  catId: null
}, {
  id: '5a29b6a142764d409a6b5e24',
  title: 'mortgage',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a1427f0b40b7a427c7',
  title: 'rent',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a14209dc40846fbbcc',
  title: 'communal payments',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142d88a40a7215421',
  title: 'network',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142b16d40b459f7ef',
  title: 'mobile',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142fa2c40b3009afe',
  title: 'property insurance',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142636240a8171cab',
  title: 'tax',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142636240a8172cab',
  title: 'bank',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a14293fb40b48d4047',
  title: 'credit',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a14227124082b4e98b',
  title: 'Beauty and care',
  catId: null
}, {
  id: '5a29b6a1428d8c40a7b51345',
  title: 'cosmetics',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142de3e408d66e08d',
  title: 'hairdresser',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142096b40bb29761e',
  title: 'massage',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142c26040b85fdb46',
  title: 'workout',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142f61d40b73303dd',
  title: 'procedures',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a14272fb4086aaed1a',
  title: 'Health',
  catId: null
}, {
  id: '5a29b6a142543c408678b32d',
  title: 'pharmacy',
  catId: '5a29b6a14272fb4086aaed1a'
}, {
  id: '5a29b6a14264454087a4fb5a',
  title: 'hospital',
  catId: '5a29b6a14272fb4086aaed1a'
}, {
  id: '5a29b6a142f8a640b4ff8816',
  title: 'insurance',
  catId: '5a29b6a14272fb4086aaed1a'
}, {
  id: '5a29b6a14260a0409d9c683f',
  title: 'Children',
  catId: null
}, {
  id: '5a29b6a14268cd4095b72250',
  title: 'toys',
  catId: '5a29b6a14260a0409d9c683f'
}, {
  id: '5a29b6a14294594085448e4d',
  title: 'kindergarten, school, university',
  catId: '5a29b6a14260a0409d9c683f'
}, {
  id: '5a29b6a142798a408c797782',
  title: 'Education',
  catId: null
}, {
  id: '5a29b6a142464a40b9929469',
  title: 'courses, trainings',
  catId: '5a29b6a142798a408c797782'
}, {
  id: '5a29b6a142a40940b8fd0eba',
  title: 'books, magazines',
  catId: '5a29b6a142798a408c797782'
}, {
  id: '5a29b6a142ae0840ae9e6e4a',
  title: 'University',
  catId: '5a29b6a142798a408c797782'
}, {
  id: '5a29b6a142cc1140a64d322f',
  title: 'Hobbies',
  catId: null
}, {
  id: '5a29b6a142d7f540b4f08a1a',
  title: 'Entertainment',
  catId: null
}];

const categoriesDefaultRu = [{
  id: '5a29b6a142c84c408b60f441',
  title: 'Одежда, обувь',
  catId: null
}, {
  id: '5a29b6a142784f408c024722',
  title: 'аксесуары',
  catId: '5a29b6a142c84c408b60f441'
}, {
  id: '5a29b6a14208df40903de075',
  title: 'обувь',
  catId: '5a29b6a142c84c408b60f441'
}, {
  id: '5a29b6a142f7c940ae912738',
  title: 'одежда',
  catId: '5a29b6a142c84c408b60f441'
}, {
  id: '5a29b6a1420afd40b28f75ea',
  title: 'Питание',
  catId: null
}, {
  id: '5a29b6a1426c004093476371',
  title: 'кафе/ресторан',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a142b30340b20e6839',
  title: 'перекус (пирожок)',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a142d91440b2102cf3',
  title: 'магазин',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a1426ad340a0c3576e',
  title: 'обед',
  catId: '5a29b6a1420afd40b28f75ea'
}, {
  id: '5a29b6a142ef4040992cbaca',
  title: 'Разное',
  catId: null
}, {
  id: '5a29b6a142bd5b409db65b1d',
  title: 'помощь',
  catId: '5a29b6a142ef4040992cbaca'
}, {
  id: '5a29b6a142c5c3408618b78b',
  title: 'подарки',
  catId: '5a29b6a142ef4040992cbaca'
}, {
  id: '5a29b6a142ab6040b0791598',
  title: 'незапланированое',
  catId: '5a29b6a142ef4040992cbaca'
}, {
  id: '5a29b6a142cd6740a567c3e2',
  title: 'Путешествия',
  catId: null
}, {
  id: '5a29b6a1420dc84090489cee',
  title: 'транспорт',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a142c81d40a2156380',
  title: 'сувениры',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a14254cc409594e679',
  title: 'связь',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a14254cc409594e772',
  title: 'жилье',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a142d35940913422c9',
  title: 'еда',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a142d35940913421c9',
  title: 'разное',
  catId: '5a29b6a142cd6740a567c3e2'
}, {
  id: '5a29b6a1426c2640b230815c',
  title: 'Личный транспорт',
  catId: null
}, {
  id: '5a29b6a142970240b329d8e3',
  title: 'топливо',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a1424bdc40ad4221a1',
  title: 'ремонт',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142207340a47d4600',
  title: 'страховка',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142a61e4087159fa1',
  title: 'ТО',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a14260924081070e6d',
  title: 'штраф',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142d27840b9aa932a',
  title: 'налог',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142006a40b7509318',
  title: 'парковка',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a1424dad40a32d06bf',
  title: 'мойка',
  catId: '5a29b6a1426c2640b230815c'
}, {
  id: '5a29b6a142539c40b39d5ec6',
  title: 'Транспорт',
  catId: null
}, {
  id: '5a29b6a142eed840a39539ec',
  title: 'такси',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142b294409d8ac8d8',
  title: 'поезд',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a1428627408175ff12',
  title: 'самолет',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a1428627408175fa11',
  title: 'попутка',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142e708409984fde3',
  title: 'общественный',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142d95b40b0010f7f',
  title: 'корабль',
  catId: '5a29b6a142539c40b39d5ec6'
}, {
  id: '5a29b6a142d994408e7c13dd',
  title: 'Дом',
  catId: null
}, {
  id: '5a29b6a142624940a849393e',
  title: 'быт. химия',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a14232d6409c91622c',
  title: 'мебель',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a142143d40bffb6df1',
  title: 'посуда',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a142f1a9408048a97b',
  title: 'ремонт',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a142066f409f54f8c1',
  title: 'канц. товары',
  catId: '5a29b6a142d994408e7c13dd'
}, {
  id: '5a29b6a14218fc4086045f3a',
  title: 'Счета и услуги',
  catId: null
}, {
  id: '5a29b6a142764d409a6b5e24',
  title: 'ипотека',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a1427f0b40b7a427c7',
  title: 'аренда',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a14209dc40846fbbcc',
  title: 'коммунальные платежи',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142d88a40a7215421',
  title: 'инет',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142b16d40b459f7ef',
  title: 'моб. связь',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142fa2c40b3009afe',
  title: 'страховка имущества',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142636240a8171cab',
  title: 'налог',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a142636240a8172cab',
  title: 'банк',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a14293fb40b48d4047',
  title: 'кредит',
  catId: '5a29b6a14218fc4086045f3a'
}, {
  id: '5a29b6a14227124082b4e98b',
  title: 'Красота и уход',
  catId: null
}, {
  id: '5a29b6a1428d8c40a7b51345',
  title: 'косметика',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142de3e408d66e08d',
  title: 'парикмахер',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142096b40bb29761e',
  title: 'массаж',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142c26040b85fdb46',
  title: 'тренировки',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a142f61d40b73303dd',
  title: 'процедуры',
  catId: '5a29b6a14227124082b4e98b'
}, {
  id: '5a29b6a14272fb4086aaed1a',
  title: 'Здоровье',
  catId: null
}, {
  id: '5a29b6a142543c408678b32d',
  title: 'аптека',
  catId: '5a29b6a14272fb4086aaed1a'
}, {
  id: '5a29b6a14264454087a4fb5a',
  title: 'больница',
  catId: '5a29b6a14272fb4086aaed1a'
}, {
  id: '5a29b6a142f8a640b4ff8816',
  title: 'страхование',
  catId: '5a29b6a14272fb4086aaed1a'
}, {
  id: '5a29b6a14260a0409d9c683f',
  title: 'Дети',
  catId: null
}, {
  id: '5a29b6a14268cd4095b72250',
  title: 'игрушки',
  catId: '5a29b6a14260a0409d9c683f'
}, {
  id: '5a29b6a14294594085448e4d',
  title: 'садик, школа, универ',
  catId: '5a29b6a14260a0409d9c683f'
}, {
  id: '5a29b6a142798a408c797782',
  title: 'Образование',
  catId: null
}, {
  id: '5a29b6a142464a40b9929469',
  title: 'курсы, тренинги',
  catId: '5a29b6a142798a408c797782'
}, {
  id: '5a29b6a142a40940b8fd0eba',
  title: 'книги, журналы',
  catId: '5a29b6a142798a408c797782'
}, {
  id: '5a29b6a142ae0840ae9e6e4a',
  title: 'ВУЗ',
  catId: '5a29b6a142798a408c797782'
}, {
  id: '5a29b6a142cc1140a64d322f',
  title: 'Хобби',
  catId: null
}, {
  id: '5a29b6a142d7f540b4f08a1a',
  title: 'Развлечения',
  catId: null
}];

var __decorate$y = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const defaultCategories = {
  en: categoriesDefaultEn,
  ru: categoriesDefaultRu
};
let EmptyStore = class EmptyStore {
  changeDefaultCategory(value) {
    this.selectedDefaultCategories = value;
  }

  get defaultCategories() {
    return defaultCategories[this.selectedDefaultCategories];
  }

  constructor() {
    this.selectedDefaultCategories = 'en';
  }

};
EmptyStore = __decorate$y([Store()], EmptyStore);

function asyncGeneratorStep$o(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$o(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$o(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$o(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$x = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$l = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$l = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let EmptyService = class EmptyService {
  changeDefaultCategory(selectedCategory) {
    this.emptyStore.changeDefaultCategory(selectedCategory);
  }

  applyDefaultCategory() {
    var _this = this;

    return _asyncToGenerator$o(function* () {
      const lang = _this.emptyStore.selectedDefaultCategories;

      _this.langStore.changeLanguage(lang);

      const categories = _this.emptyStore.defaultCategories;
      if (!categories) return;
      const result = yield _this.appAdapter.defineCategories(categories);

      if (result.isErr()) {
        //TODO: add error processing
        return;
      }
    })();
  }

  constructor(emptyStore, langStore, appAdapter) {
    this.emptyStore = emptyStore;
    this.langStore = langStore;
    this.appAdapter = appAdapter;
  }

};
EmptyService = __decorate$x([Service(), __param$l(0, Inject()), __param$l(1, Inject()), __param$l(2, Inject()), __metadata$l("design:type", Function), __metadata$l("design:paramtypes", [typeof EmptyStore === "undefined" ? Object : EmptyStore, typeof LangStore === "undefined" ? Object : LangStore, typeof AppAdapter === "undefined" ? Object : AppAdapter])], EmptyService);

function asyncGeneratorStep$n(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$n(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$n(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$n(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$w = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$k = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$k = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let EmptyAction = class EmptyAction {
  handleChangeCategory(selectedCategory) {
    this.emptyService.changeDefaultCategory(selectedCategory);
  }

  handleApplyCategory() {
    var _this = this;

    return _asyncToGenerator$n(function* () {
      yield _this.emptyService.applyDefaultCategory();

      _this.historyService.push(Routes.categories);
    })();
  }

  handleOpenSettings() {
    this.historyService.push(Routes.settings);
  }

  constructor(historyService, emptyService) {
    this.historyService = historyService;
    this.emptyService = emptyService;
  }

};
EmptyAction = __decorate$w([Action(), __param$k(0, Inject()), __param$k(1, Inject()), __metadata$k("design:type", Function), __metadata$k("design:paramtypes", [typeof HistoryService === "undefined" ? Object : HistoryService, typeof EmptyService === "undefined" ? Object : EmptyService])], EmptyAction);

const {
  useModuleContext: useAppContext
} = hookContextFactory({
  navigationAction: NavigationAction,
  emptyAction: EmptyAction,
  emptyStore: EmptyStore
});

function useNaviItem({
  isMatch,
  path
}) {
  const {
    historyStore
  } = useHistoryContext();
  const isMatched = isMatch ? historyStore.pathname === path : historyStore.pathname.startsWith(path);
  const {
    navigationAction
  } = useAppContext();
  const handleChangePage = T$1(() => {
    navigationAction.handleChangePage(path);
  }, [navigationAction, path]);
  return {
    isMatched,
    handleChangePage
  };
}

const NaviItem = observer(({
  isMatch,
  path,
  icon,
  title
}) => {
  const {
    isMatched,
    handleChangePage
  } = useNaviItem({
    isMatch,
    path
  });
  return /*#__PURE__*/e(Container$i, {
    isMatched: isMatched,
    onClick: handleChangePage,
    children: [/*#__PURE__*/e(Icon, {
      iconName: icon
    }), /*#__PURE__*/e(Title$2, {
      children: title
    })]
  });
});

function Navigation() {
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(Separator, {}), /*#__PURE__*/e(Container$j, {
      children: [/*#__PURE__*/e(NaviItem, {
        path: Routes.expense,
        isMatch: true,
        icon: "fea",
        title: t('pages.expense')
      }), /*#__PURE__*/e(NaviItem, {
        path: Routes.analytic,
        icon: "activity",
        title: t('pages.analytic')
      }), /*#__PURE__*/e(NaviItem, {
        path: Routes.categories,
        icon: "layers",
        title: t('pages.category')
      }), /*#__PURE__*/e(NaviItem, {
        path: Routes.settings,
        icon: "settings",
        title: t('pages.settings')
      })]
    })]
  });
}

function removeLoader() {
  var ref, ref1;
  const loaderNode = document.getElementById('loader');
  if (!loaderNode) return;
  (ref = loaderNode.parentNode) === null || ref === void 0 ? void 0 : ref.removeChild(loaderNode);
  const loaderStyles = document.querySelector("[data-type='loader']");
  if (!loaderStyles) return;
  (ref1 = loaderStyles.parentNode) === null || ref1 === void 0 ? void 0 : ref1.removeChild(loaderStyles);
}

function Loader$1() {
  _(() => {
    const timerId = window.setTimeout(removeLoader, 500);
    return () => {
      window.clearTimeout(timerId);
    };
  }, []);
  return null;
}

// ---------------- hash support ------------------------

const currentLocation = (base, path = window.location.hash.replace('#', '')) => !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || '/' : `~${path}`;

const base = '';
const useHashLocation = () => {
  const [{
    path
  }, setState] = y({
    path: currentLocation(base),
    search: ''
  });
  const prevHash = s(path);
  _(() => {
    // this function is called whenever the hash changes
    const handler = () => {
      const baseHash = currentLocation(base);

      if (prevHash.current !== baseHash) {
        prevHash.current = baseHash;
        const [newLoc, newSearch] = baseHash.split('?');
        setState({
          path: newLoc,
          search: newSearch
        });
      }
    }; // subscribe to hash changes


    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);
  const navigate = T$1(to => {
    window.location.hash = to[0] === '~' ? to.slice(1) : base + to;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [base]);
  return [path, navigate];
};

function HistoryAdapter() {
  const [pathname, setLocation] = useLocation();
  const {
    historyStore,
    routerHistory
  } = useHistoryContext();
  routerHistory.setHistory(setLocation);
  historyStore.updateState(pathname);
  return null;
}

const baseUrl = ({}).VITE_BASE_URL.slice(0, -1);
function BaseRouter({
  children
}) {
  return /*#__PURE__*/e(Router, {
    base: baseUrl,
    hook: useHashLocation,
    children: [/*#__PURE__*/e(HistoryAdapter, {}), children]
  });
}

addBlock({
  data: {
    pages: {
      expense: ['Expenses', 'Расходы'],
      analytic: ['Analytic', 'Аналитика'],
      category: ['Categories', 'Категории'],
      settings: ['Settings', 'Настройки']
    },
    firstView: {
      t: ['Select Category', 'Выбор категорий'],
      select: ['At first you need to choose which categories to use:', 'Для начала нужно выбрать, какие категории использовать:'],
      use: ['Use selected', 'Использовать выбранное'],
      import: ['Go to import', 'Перейти в импорт'],
      or: ['or...', 'или...']
    }
  }
});

const App = observer(() => {
  const {
    langStore
  } = useLanguageContext();
  useFocus();
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(Loader$1, {}), /*#__PURE__*/e(ThemeDefine, {}), /*#__PURE__*/e(BaseRouter, {
      children: /*#__PURE__*/e(Layout, {
        headerSlot: /*#__PURE__*/e(Header$1, {}),
        contentSlot: /*#__PURE__*/e(ScreensSwitch, {}),
        footerSlot: /*#__PURE__*/e(Navigation, {})
      }, langStore.currentLanguage)
    })]
  });
});

function startRender() {
  const node = document.getElementById('root');
  if (!node) return;
  S$1( /*#__PURE__*/e(App, {}), node);
}

var __decorate$v = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let AppModule = class AppModule {
  start() {
    startRender();
  }

};
AppModule = __decorate$v([Module()], AppModule);

var radioButtonStyles_1q7p743 = '';

const Container$h = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1cdzirs"
});

function RadioButton({
  isChecked,
  name,
  value,
  children,
  onChange
}) {
  const handleChange = T$1(ev => {
    const value = ev.target.value;
    onChange(value);
  }, [onChange]);
  return /*#__PURE__*/e(Container$h, {
    children: /*#__PURE__*/e("label", {
      children: [/*#__PURE__*/e("input", {
        value: value,
        name: name,
        checked: isChecked,
        type: "radio",
        onChange: handleChange
      }), /*#__PURE__*/e("span", {}), children]
    })
  });
}

var buttonStyles_ftg82k = '';

const variantClass = variant => {
  switch (variant) {
    case 'secondary':
      return "vkyxcsm";

    case 'flat':
      return "v1ltbdar";

    default:
      return '';
  }
};

const shapeClass = shape => {
  switch (shape) {
    case 'circle':
      return "s1temqrh";

    case 'rect':
      return "sgj6qeu";

    default:
      return '';
  }
};

const extendedClasses$2 = ({
  variant,
  shape
}) => {
  return cx$1(variantClass(variant), shapeClass(shape));
};
const Container$g = /*#__PURE__*/styled$1("button")({
  name: "Container",
  class: "c130ml0",
  vars: {
    "c130ml0-0": [props => variantClass(props.variant)]
  }
});
const Wrapper$2 = /*#__PURE__*/styled$1("div")({
  name: "Wrapper",
  class: "w1tbozxl",
  vars: {
    "w1tbozxl-0": [props => {
      if (!props.hasIcon) return '';
      return "w1ov613n";
    }]
  }
});

function Button({
  children,
  iconName,
  iconSize,
  variant,
  onClick,
  isDisabled,
  shape = 'rect'
}) {
  const hasChildren = !!children;
  return /*#__PURE__*/e(Container$g, {
    onClick: onClick,
    disabled: isDisabled,
    className: extendedClasses$2({
      variant,
      shape
    }),
    children: [iconName && /*#__PURE__*/e(Icon, {
      iconName: iconName,
      iconSize: iconSize
    }), hasChildren && /*#__PURE__*/e(Wrapper$2, {
      "data-has-icon": !!iconName,
      children: children
    })]
  });
}

var emptyPageStyles_1yssz39 = '';

const Container$f = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1orbz7d"
});
const Controls$2 = /*#__PURE__*/styled$1("div")({
  name: "Controls",
  class: "c1iejz2w"
});
const Title$1 = /*#__PURE__*/styled$1("div")({
  name: "Title",
  class: "t3q74g2"
});
const SubTitle$1 = /*#__PURE__*/styled$1("div")({
  name: "SubTitle",
  class: "s1n3hziz"
});
const Block$1 = /*#__PURE__*/styled$1("span")({
  name: "Block",
  class: "b1xlhlt2"
});

const EMPTY_CATEGORY = 'category';
function EmptyPage() {
  const {
    emptyAction,
    emptyStore
  } = useAppContext();
  return /*#__PURE__*/e(Container$f, {
    children: [/*#__PURE__*/e(Title$1, {
      children: t('firstView.t')
    }), /*#__PURE__*/e(SubTitle$1, {
      children: t('firstView.select')
    }), /*#__PURE__*/e(RadioButton, {
      isChecked: emptyStore.selectedDefaultCategories === 'ru',
      name: EMPTY_CATEGORY,
      value: 'ru',
      onChange: emptyAction.handleChangeCategory,
      children: "Русский набор категорий"
    }), /*#__PURE__*/e(RadioButton, {
      isChecked: emptyStore.selectedDefaultCategories === 'en',
      name: EMPTY_CATEGORY,
      value: 'en',
      onChange: emptyAction.handleChangeCategory,
      children: "English category set"
    }), /*#__PURE__*/e(Controls$2, {
      children: [/*#__PURE__*/e(Button, {
        onClick: emptyAction.handleApplyCategory,
        children: t('firstView.use')
      }), /*#__PURE__*/e(Block$1, {
        children: t('firstView.or')
      }), /*#__PURE__*/e(Button, {
        onClick: emptyAction.handleOpenSettings,
        children: t('firstView.import')
      })]
    })]
  });
}

const appRoutes = [{
  route: {
    path: Routes.empty
  },
  component: EmptyPage,
  withNavigation: true
}, {
  route: {},
  component: NotFoundPage,
  withNavigation: true
}];

var toggleStyles_1j8gt84 = '';

const Container$e = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1rvkqiu"
});

let swId = 1;
function Toggle({
  name,
  checked
}) {
  const elId = F$1(() => {
    swId++;
    return name || `sw-${swId}`;
  }, [name]);
  return /*#__PURE__*/e(Container$e, {
    name: name,
    children: [/*#__PURE__*/e("input", {
      type: "checkbox",
      id: elId,
      name: elId,
      checked: checked,
      disabled: true
    }), /*#__PURE__*/e("label", {
      htmlFor: elId
    })]
  });
}

var listStyles_n2nf4w = '';

const ListContainer = /*#__PURE__*/styled$1("div")({
  name: "ListContainer",
  class: "l1ic5100"
});
const ListRow = /*#__PURE__*/styled$1("div")({
  name: "ListRow",
  class: "l129895c"
});
const extendedClasses$1 = ({
  isFullwidth,
  isCentered
}) => {
  return cx$1(isCentered ? "emlc2gb" : '', isFullwidth ? "e1j9or7p" : '');
};
const ListCellWrapper = /*#__PURE__*/styled$1("div")({
  name: "ListCellWrapper",
  class: "l1l9b3q2"
});

function ListCell({
  children,
  isCentered,
  isFullwidth
}) {
  return /*#__PURE__*/e(ListCellWrapper, {
    className: extendedClasses$1({
      isFullwidth,
      isCentered
    }),
    children: children
  });
}

function List({
  children
}) {
  return /*#__PURE__*/e(ListContainer, {
    children: children
  });
}
List.Row = ListRow;
List.Cell = ListCell;

var lzString = {exports: {}};

(function (module) {
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if( module != null ) {
  module.exports = LZString;
}
}(lzString));

var lz = lzString.exports;

function asyncGeneratorStep$m(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$m(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$m(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$m(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$u = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const windowConfirm = window.confirm;
const windowPrompt = window.prompt;
const windowAlert = window.alert;
let MessageBoxService = class MessageBoxService {
  confirm(message) {
    return _asyncToGenerator$m(function* () {
      return new Promise(resolve => {
        if (windowConfirm(message)) return resolve(true);
        return resolve(false);
      });
    })();
  }

  prompt(message, defaultValue) {
    return _asyncToGenerator$m(function* () {
      return new Promise(resolve => {
        const data = windowPrompt(message, defaultValue);
        if (data) return resolve({
          data,
          isApplied: true
        });
        resolve({
          isApplied: false,
          data: ''
        });
      });
    })();
  }

  alert(message) {
    return _asyncToGenerator$m(function* () {
      return new Promise(resolve => {
        windowAlert(message);
        return resolve();
      });
    })();
  }

};
MessageBoxService = __decorate$u([Service()], MessageBoxService);

var SettingsErrors;

(function (SettingsErrors) {
  SettingsErrors.ImportResponse = createErrorClass('Failed import');
  SettingsErrors.UnexpectedErrorImport = createErrorClass('Unexpected import');
  SettingsErrors.DropDataResponse = createErrorClass('Failed drop data');
  SettingsErrors.UnexpectedErrorDropData = createErrorClass('Unexpected drop data');
  SettingsErrors.LoadDataResponse = createErrorClass('Failed load data');
  SettingsErrors.UnexpectedLoadData = createErrorClass('Unexpected load data');
})(SettingsErrors || (SettingsErrors = {}));

function asyncGeneratorStep$l(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$l(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$l(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$l(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$t = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let SettingsDataProvider = class SettingsDataProvider extends DatabaseDataProvider {
  importData(input) {
    var _this = this;

    return _asyncToGenerator$l(function* () {
      yield Promise.all([_this.client.expense.clear(), _this.client.category.clear(), _this.client.pouch.clear()]);
      yield Promise.all([_this.client.pouch.bulkAdd(input.pouch), _this.client.category.bulkAdd(input.category), _this.client.expense.bulkAdd(input.expense)]);
      return _this.ok(true);
    })();
  }

  dropData() {
    var _this = this;

    return _asyncToGenerator$l(function* () {
      yield Promise.all([_this.client.expense.clear(), _this.client.category.clear(), _this.client.pouch.clear()]);
      return _this.ok(true);
    })();
  }

  getAllData() {
    var _this = this;

    return _asyncToGenerator$l(function* () {
      const [expense, category, pouch] = yield Promise.all([_this.client.expense.orderBy('id').toArray(), _this.client.category.orderBy('id').toArray(), _this.client.pouch.orderBy('id').toArray()]);
      return _this.ok({
        expense,
        category,
        pouch
      });
    })();
  }

};
SettingsDataProvider = __decorate$t([DataProvider()], SettingsDataProvider);

function asyncGeneratorStep$k(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$k(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$k(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$k(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$s = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$j = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$j = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let SettingsAdapter = class SettingsAdapter {
  importData(input) {
    var _this = this;

    return _asyncToGenerator$k(function* () {
      try {
        const {
          error
        } = yield _this.settingsDataProvider.importData(input);
        if (error) return dist.Result.Err(new SettingsErrors.ImportResponse(error));
        return dist.Result.Ok(null);
      } catch (e) {
        return dist.Result.Err(new SettingsErrors.UnexpectedErrorImport(e));
      }
    })();
  }

  dropData() {
    var _this = this;

    return _asyncToGenerator$k(function* () {
      try {
        const {
          error
        } = yield _this.settingsDataProvider.dropData();
        if (error) return dist.Result.Err(new SettingsErrors.DropDataResponse(error));
        return dist.Result.Ok(null);
      } catch (e) {
        return dist.Result.Err(new SettingsErrors.UnexpectedErrorDropData(e));
      }
    })();
  }

  getAllData() {
    var _this = this;

    return _asyncToGenerator$k(function* () {
      try {
        const {
          error,
          data
        } = yield _this.settingsDataProvider.getAllData();
        if (error) return dist.Result.Err(new SettingsErrors.LoadDataResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new SettingsErrors.UnexpectedLoadData(e));
      }
    })();
  }

  constructor(settingsDataProvider) {
    this.settingsDataProvider = settingsDataProvider;
  }

};
SettingsAdapter = __decorate$s([Adapter(), __param$j(0, Inject()), __metadata$j("design:type", Function), __metadata$j("design:paramtypes", [typeof SettingsDataProvider === "undefined" ? Object : SettingsDataProvider])], SettingsAdapter);

function asyncGeneratorStep$j(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$j(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$j(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$j(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$r = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let FileService = class FileService {
  saveToFile(fileName, content) {
    const element = document.createElement('a');
    const header = `data:application/text;charset=utf-8,`;
    element.setAttribute('href', header + encodeURIComponent(content));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  readTextFile(file) {
    return _asyncToGenerator$j(function* () {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = function (e) {
          reject && reject(e);
        };

        reader.onload = function (e) {
          var ref;
          const data = (ref = e.target) === null || ref === void 0 ? void 0 : ref.result;
          resolve(data);
        };

        reader.readAsText(file);
      });
    })();
  }

};
FileService = __decorate$r([Service()], FileService);

var scrollContainerStyles_qkk51a = '';

const ScrollContainer = /*#__PURE__*/styled$1("div")({
  name: "ScrollContainer",
  class: "s11703p9"
});

const guidStore = new LocalStorageItem('guid');
let machineId = guidStore.value;
const lut = [];

function init() {
  if (!machineId) {
    machineId = Math.abs(Math.random() * 0xff | 0).toString(16);
    guidStore.set(machineId);
  }

  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
  }
}

init();
function guid() {
  const timeObj = new Date().getTime();
  const s = Math.floor(timeObj / 1000);
  const ms = timeObj - s * 1000;
  const d1 = ms + Math.random() * 0xffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = machineId // Math.random()*0xffffffff|0;
  ;
  const d4 = s.toString(16);
  return d4 + // @ts-ignore
  lut[d3 & 0xff] + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff];
}

var CategoriesErrors;

(function (CategoriesErrors) {
  CategoriesErrors.AddResponse = createErrorClass('Failed add category');
  CategoriesErrors.UnexpectedErrorAdd = createErrorClass('Unexpected add category');
  CategoriesErrors.GetListResponse = createErrorClass('Failed get category list');
  CategoriesErrors.UnexpectedErrorGetList = createErrorClass('Unexpected get category list');
  CategoriesErrors.UpdateCategoryResponse = createErrorClass('Failed update category');
  CategoriesErrors.UnexpectedErrorUpdateCategory = createErrorClass('Unexpected update category');
  CategoriesErrors.RemoveCategoryResponse = createErrorClass('Failed remove category');
  CategoriesErrors.UnexpectedErrorRemoveCategory = createErrorClass('Unexpected remove category');
})(CategoriesErrors || (CategoriesErrors = {}));

function asyncGeneratorStep$i(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$i(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$i(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$i(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$q = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

function checkDateEnd$1(item) {
  return !item.dateEnd;
}

let CategoriesDataProvider = class CategoriesDataProvider extends DatabaseDataProvider {
  addCategory(category) {
    var _this = this;

    return _asyncToGenerator$i(function* () {
      const result = yield _this.client.category.add(category);
      return _this.ok(result);
    })();
  }

  getCategories() {
    var _this = this;

    return _asyncToGenerator$i(function* () {
      const result = yield _this.client.category.filter(checkDateEnd$1).toArray();
      return _this.ok(result);
    })();
  }

  updateCategoryTitle(id, title) {
    var _this = this;

    return _asyncToGenerator$i(function* () {
      const fields = {
        title
      };
      const result = yield _this.client.category.where('id').equals(id).modify(fields);
      return _this.ok(result);
    })();
  }

  removeCategory(id) {
    var _this = this;

    return _asyncToGenerator$i(function* () {
      const fields = {
        dateEnd: Date.now()
      };
      const result = yield _this.client.category.where('id').equals(id).modify(fields);
      return _this.ok(result);
    })();
  }

};
CategoriesDataProvider = __decorate$q([DataProvider()], CategoriesDataProvider);

function asyncGeneratorStep$h(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$h(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$h(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$h(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$p = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$i = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$i = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let CategoriesAdapter = class CategoriesAdapter {
  addCategory(category) {
    var _this = this;

    return _asyncToGenerator$h(function* () {
      try {
        const {
          error
        } = yield _this.categoriesDataProvider.addCategory(category);
        if (error) return dist.Result.Err(new CategoriesErrors.AddResponse(error));
        return dist.Result.Ok(true);
      } catch (e) {
        return dist.Result.Err(new CategoriesErrors.UnexpectedErrorAdd(e));
      }
    })();
  }

  getCategories() {
    var _this = this;

    return _asyncToGenerator$h(function* () {
      try {
        const {
          error,
          data
        } = yield _this.categoriesDataProvider.getCategories();
        if (error) return dist.Result.Err(new CategoriesErrors.GetListResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new CategoriesErrors.UnexpectedErrorGetList(e));
      }
    })();
  }

  updateCategoryTitle(id, title) {
    var _this = this;

    return _asyncToGenerator$h(function* () {
      try {
        const {
          error
        } = yield _this.categoriesDataProvider.updateCategoryTitle(id, title);
        if (error) return dist.Result.Err(new CategoriesErrors.UpdateCategoryResponse(error));
        return dist.Result.Ok(true);
      } catch (e) {
        return dist.Result.Err(new CategoriesErrors.UnexpectedErrorUpdateCategory(e));
      }
    })();
  }

  removeCategory(id) {
    var _this = this;

    return _asyncToGenerator$h(function* () {
      try {
        const {
          error
        } = yield _this.categoriesDataProvider.removeCategory(id);
        if (error) return dist.Result.Err(new CategoriesErrors.RemoveCategoryResponse(error));
        return dist.Result.Ok(true);
      } catch (e) {
        return dist.Result.Err(new CategoriesErrors.UnexpectedErrorRemoveCategory(e));
      }
    })();
  }

  constructor(categoriesDataProvider) {
    this.categoriesDataProvider = categoriesDataProvider;
  }

};
CategoriesAdapter = __decorate$p([Adapter(), __param$i(0, Inject()), __metadata$i("design:type", Function), __metadata$i("design:paramtypes", [typeof CategoriesDataProvider === "undefined" ? Object : CategoriesDataProvider])], CategoriesAdapter);

var __decorate$o = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let CategoriesStore = class CategoriesStore {
  setIsLoading(value) {
    this.isLoading = value;
  }

  setSelectedCategoryId(value) {
    this.selectedCategoryId = value;
  }

  setCategoryList(value) {
    this.categoryList = value;
  }

  dropCategories() {
    this.categoryList = [];
  }

  setFilter(callback) {
    this.filter = callback;
  }

  checkFilter(item) {
    if (!this.filter) return true;
    return this.filter(item);
  }

  get maps() {
    const rootMap = {};
    const categoryMap = {};
    this.categoryList.forEach(item => {
      categoryMap[item.id] = item;
      const isRoot = !item.catId;
      const createId = item.catId ? item.catId : item.id;
      const parent = rootMap[createId] = rootMap[createId] || {
        children: []
      };
      if (isRoot) return;
      if (!this.checkFilter(item)) return;
      parent.children.push(item.id);
    });
    return {
      rootMap,
      categoryMap
    };
  }

  get isEmptyCategories() {
    return this.categoryList.length === 0;
  }

  get selectedCategory() {
    return this.categoryList.find(category => category.id === this.selectedCategoryId);
  }

  get categoryTree() {
    const {
      categoryMap,
      rootMap
    } = this.maps;
    const filteredKeys = Object.keys(rootMap).filter(key => {
      const item = categoryMap[key];
      if (!item) return false;
      return this.checkFilter(item);
    });
    const result = filteredKeys.reduce((acc, key) => {
      const item = categoryMap[key];
      const rootEl = rootMap[key];
      acc.push({
        item,
        isRoot: true
      });
      rootEl.children.forEach(id => {
        const node = categoryMap[id];
        acc.push({
          item: node
        });
      });
      return acc;
    }, []);
    return result;
  }

  constructor() {
    this.selectedCategoryId = '';
    this.isLoading = true;
    this.categoryList = [];
  }

};
CategoriesStore = __decorate$o([Store()], CategoriesStore);

function asyncGeneratorStep$g(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$g(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$g(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$g(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$n = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$h = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$h = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let CategoriesService = class CategoriesService {
  removeCategory() {
    var _this = this;

    return _asyncToGenerator$g(function* () {
      const category = _this.categoriesStore.selectedCategory;
      if (!category) return;
      const isConfirmed = yield _this.messageBoxService.confirm(t('category.confirmRemove'));
      if (!isConfirmed) return;
      const result = yield _this.categoriesAdapter.removeCategory(category.id);

      if (result.isErr()) {
        //TODO: add error processing
        return;
      }

      _this.categoriesStore.setSelectedCategoryId('');

      yield _this.loadCategories();
    })();
  }

  editCategory() {
    var _this = this;

    return _asyncToGenerator$g(function* () {
      const category = _this.categoriesStore.selectedCategory;
      if (!category) return;
      const {
        isApplied,
        data: newTitle
      } = yield _this.messageBoxService.prompt(t('category.edit'), category.title);
      if (!isApplied) return;
      const result = yield _this.categoriesAdapter.updateCategoryTitle(category.id, newTitle);

      if (result.isErr()) {
        //TODO: add error processing
        return;
      }

      yield _this.loadCategories();
    })();
  }

  addCategory() {
    var _this = this;

    return _asyncToGenerator$g(function* () {
      const parentCategoryId = _this.categoriesStore.selectedCategoryId;
      const {
        isApplied,
        data: categoryName
      } = yield _this.messageBoxService.prompt(parentCategoryId ? t('category.addSubNew') : t('category.addNew'));
      if (!isApplied) return;
      const node = {
        id: guid(),
        catId: parentCategoryId,
        title: categoryName
      };
      const addResult = yield _this.categoriesAdapter.addCategory(node);

      if (addResult.isErr()) {
        //TODO: add error processing
        return;
      }

      yield _this.loadCategories();
    })();
  }

  loadCategories() {
    var _this = this;

    return _asyncToGenerator$g(function* () {
      const result = yield _this.categoriesAdapter.getCategories();

      if (result.isErr()) {
        //TODO: add error processing
        return;
      }

      const categories = result.getValue();

      _this.categoriesStore.setCategoryList(categories);
    })();
  }

  constructor(messageBoxService, categoriesAdapter, categoriesStore) {
    this.messageBoxService = messageBoxService;
    this.categoriesAdapter = categoriesAdapter;
    this.categoriesStore = categoriesStore;
  }

};
CategoriesService = __decorate$n([Service(), __param$h(0, Inject()), __param$h(1, Inject()), __param$h(2, Inject()), __metadata$h("design:type", Function), __metadata$h("design:paramtypes", [typeof MessageBoxService === "undefined" ? Object : MessageBoxService, typeof CategoriesAdapter === "undefined" ? Object : CategoriesAdapter, typeof CategoriesStore === "undefined" ? Object : CategoriesStore])], CategoriesService);

function asyncGeneratorStep$f(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$f(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$f(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$f(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$m = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$g = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$g = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let CategoriesAction = class CategoriesAction {
  handleAddCategory() {
    this.categoriesService.addCategory();
  }

  handleEditCategory() {
    this.categoriesService.editCategory();
  }

  handleRemoveCategory() {
    this.categoriesService.removeCategory();
  }

  handleInitialLoadCategoryList() {
    var _this = this;

    return _asyncToGenerator$f(function* () {
      if (!_this.categoriesStore.isEmptyCategories) return;

      _this.categoriesStore.setIsLoading(true);

      yield _this.categoriesService.loadCategories();

      _this.categoriesStore.setIsLoading(false);

      if (_this.categoriesStore.isEmptyCategories) {
        _this.historyService.push(Routes.empty);
      }
    })();
  }

  toggleSelectedCategoryId(categoryId) {
    const nextCatId = this.categoriesStore.selectedCategoryId === categoryId ? '' : categoryId;
    this.categoriesStore.setSelectedCategoryId(nextCatId);
  }

  constructor(categoriesService, categoriesStore, historyService) {
    this.categoriesService = categoriesService;
    this.categoriesStore = categoriesStore;
    this.historyService = historyService;
  }

};
CategoriesAction = __decorate$m([Action(), __param$g(0, Inject()), __param$g(1, Inject()), __param$g(2, Inject()), __metadata$g("design:type", Function), __metadata$g("design:paramtypes", [typeof CategoriesService === "undefined" ? Object : CategoriesService, typeof CategoriesStore === "undefined" ? Object : CategoriesStore, typeof HistoryService === "undefined" ? Object : HistoryService])], CategoriesAction);

const {
  useModuleContext: useCategoriesContext
} = hookContextFactory({
  categoriesAction: CategoriesAction,
  categoriesStore: CategoriesStore
});

var loaderStyles_1mph9ax = '';

const Container$d = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c268xqd"
});
const Wrapper$1 = /*#__PURE__*/styled$1("div")({
  name: "Wrapper",
  class: "w13h8aj"
});

function Loader() {
  return /*#__PURE__*/e(Wrapper$1, {
    children: /*#__PURE__*/e(Icon, {
      iconName: "load",
      iconSize: "big"
    })
  });
}
function BlockLoader() {
  return /*#__PURE__*/e(Container$d, {
    children: /*#__PURE__*/e(Loader, {})
  });
}

var controlsStyles_1lojvxn = '';

const ButtonWrapper$2 = /*#__PURE__*/styled$1("div")({
  name: "ButtonWrapper",
  class: "bp37jq1"
});
const Item$2 = /*#__PURE__*/styled$1("div")({
  name: "Item",
  class: "i1ygyqrg"
});

const Controls$1 = observer(() => {
  var ref;
  const {
    categoriesAction,
    categoriesStore
  } = useCategoriesContext();
  const isChildCategory = !((ref = categoriesStore.selectedCategory) === null || ref === void 0 ? void 0 : ref.catId);
  const isSelectedCategory = !!categoriesStore.selectedCategoryId;
  const plusButtonVariant = isSelectedCategory ? 'primary' : 'secondary';
  return /*#__PURE__*/e(ButtonWrapper$2, {
    children: [/*#__PURE__*/e(Item$2, {
      children: isSelectedCategory && /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "trash",
        iconSize: "huge",
        onClick: categoriesAction.handleRemoveCategory
      })
    }), /*#__PURE__*/e(Item$2, {
      children: isSelectedCategory && /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "edit-l",
        iconSize: "huge",
        onClick: categoriesAction.handleEditCategory
      })
    }), /*#__PURE__*/e(Item$2, {
      children: isChildCategory && /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "plus",
        iconSize: "huge",
        variant: plusButtonVariant,
        onClick: categoriesAction.handleAddCategory
      })
    })]
  });
});

function getAttrFromElement(el, attribute) {
  let node = el;

  do {
    if (node.hasAttribute && node.hasAttribute(attribute)) {
      break;
    }
  } while (node = node.parentNode);

  if (node) {
    return node.getAttribute(attribute);
  }
}

var treeListStyles_17iluma = '';

const Container$c = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cik2084"
});
const extendedClasses = ({
  isActive,
  isRoot
}) => {
  return cx$1(isRoot ? "eggkn9q" : "e1k7iui1", isActive ? "etkrh1b" : '');
};
const TreeItem = /*#__PURE__*/styled$1("div")({
  name: "TreeItem",
  class: "tt6nbp3"
});

const TreeList = observer(() => {
  const {
    categoriesAction,
    categoriesStore
  } = useCategoriesContext();
  const selectedId = categoriesStore.selectedCategoryId;
  const onClick = T$1(e => {
    const categoryId = getAttrFromElement(e.target, 'data-category-id');
    if (!categoryId) return;
    categoriesAction.toggleSelectedCategoryId(categoryId);
  }, [categoriesAction]);
  return /*#__PURE__*/e(Container$c, {
    onClick: onClick,
    children: categoriesStore.categoryTree.map(treeItem => {
      const {
        item,
        isRoot
      } = treeItem;
      const isActive = item.id === selectedId;
      const key = `${item.id}-${item.title}-${item.catId}`;
      return /*#__PURE__*/e(TreeItem, {
        "data-category-id": item.id,
        className: extendedClasses({
          isActive,
          isRoot
        }),
        children: item.title
      }, key);
    })
  });
});

addBlock({
  data: {
    category: {
      addNew: ['Add new category', 'Добавить новую категорию'],
      addSubNew: ['Add new sub category', 'Добавить новую подкатегорию'],
      edit: ['Edit category', 'Изменить категорию'],
      confirmRemove: ['Are you sure want to remove category?', 'Точно удалить категорию?']
    }
  }
});

const Categories$1 = observer(() => {
  const {
    categoriesAction,
    categoriesStore
  } = useCategoriesContext();
  _(() => {
    categoriesAction.handleInitialLoadCategoryList();
  }, [categoriesAction]);
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(ScrollContainer, {
      children: /*#__PURE__*/e(Swap, {
        is: categoriesStore.isLoading,
        isSlot: /*#__PURE__*/e(Loader, {}),
        children: /*#__PURE__*/e(TreeList, {})
      })
    }), /*#__PURE__*/e(Controls$1, {})]
  });
});

const categoriesRoutes = [{
  route: {
    path: Routes.categories
  },
  header: {
    title: () => t('pages.category')
  },
  component: Categories$1,
  withHeader: true,
  withNavigation: true
}];

var PouchesErrors;

(function (PouchesErrors) {
  PouchesErrors.GetPouchesResponse = createErrorClass('Failed load pouches');
  PouchesErrors.UnexpectedErrorGetPouches = createErrorClass('Unexpected load pouches');
  PouchesErrors.RemovePouchResponse = createErrorClass('Failed to remove pouch');
  PouchesErrors.UnexpectedErrorRemovePouch = createErrorClass('Unexpected remove pouch');
  PouchesErrors.AddPouchResponse = createErrorClass('Failed to add pouch');
  PouchesErrors.UnexpectedErrorAddPouch = createErrorClass('Unexpected add pouch');
})(PouchesErrors || (PouchesErrors = {}));

function asyncGeneratorStep$e(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$e(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$e(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$e(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$l = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

function checkDateEnd(item) {
  return !item.dateEnd;
}

let PouchesDataProvider = class PouchesDataProvider extends DatabaseDataProvider {
  getPouches() {
    var _this = this;

    return _asyncToGenerator$e(function* () {
      const pouches = yield _this.client.pouch.filter(checkDateEnd).toArray();
      return _this.ok(pouches);
    })();
  }

  addPouch(pouch) {
    var _this = this;

    return _asyncToGenerator$e(function* () {
      const result = yield _this.client.pouch.add(pouch);
      return _this.ok(result);
    })();
  }

  removePouch(pouchId) {
    var _this = this;

    return _asyncToGenerator$e(function* () {
      const result = yield _this.client.pouch.update(pouchId, {
        dateEnd: Date.now()
      });
      return _this.ok(!!result);
    })();
  }

};
PouchesDataProvider = __decorate$l([DataProvider()], PouchesDataProvider);

function asyncGeneratorStep$d(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$d(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$d(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$d(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$k = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$f = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$f = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let PouchesAdapter = class PouchesAdapter {
  getPouches() {
    var _this = this;

    return _asyncToGenerator$d(function* () {
      try {
        const {
          error,
          data
        } = yield _this.pouchesDataProvider.getPouches();
        if (error) return dist.Result.Err(new PouchesErrors.GetPouchesResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new PouchesErrors.UnexpectedErrorGetPouches(e));
      }
    })();
  }

  addPouch(title) {
    var _this = this;

    return _asyncToGenerator$d(function* () {
      try {
        const pouch = {
          id: guid(),
          name: title
        };
        const {
          error,
          data
        } = yield _this.pouchesDataProvider.addPouch(pouch);
        if (error) return dist.Result.Err(new PouchesErrors.AddPouchResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new PouchesErrors.UnexpectedErrorAddPouch(e));
      }
    })();
  }

  removePouch(pouchId) {
    var _this = this;

    return _asyncToGenerator$d(function* () {
      try {
        const {
          error,
          data
        } = yield _this.pouchesDataProvider.removePouch(pouchId);
        if (error) return dist.Result.Err(new PouchesErrors.RemovePouchResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new PouchesErrors.UnexpectedErrorRemovePouch(e));
      }
    })();
  }

  constructor(pouchesDataProvider) {
    this.pouchesDataProvider = pouchesDataProvider;
  }

};
PouchesAdapter = __decorate$k([Adapter(), __param$f(0, Inject()), __metadata$f("design:type", Function), __metadata$f("design:paramtypes", [typeof PouchesDataProvider === "undefined" ? Object : PouchesDataProvider])], PouchesAdapter);

var __decorate$j = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let PouchStore = class PouchStore {
  setModalVisible(value) {
    this.isModalVisible = value;
  }

  get currentPouch() {
    const pouchId = this.pouchLocalStorage.value;
    if (!pouchId) return undefined;
    return this.pouches.find(({
      id
    }) => pouchId === id);
  }

  get currentPouchId() {
    const pouch = this.currentPouch;
    return (pouch === null || pouch === void 0 ? void 0 : pouch.id) || null;
  }

  get currentPouchName() {
    var ref;
    return ((ref = this.currentPouch) === null || ref === void 0 ? void 0 : ref.name) || t('export.pouchMain');
  }

  setCurrentPouch(id) {
    this.pouchLocalStorage.set(id);
  }

  setIsLoading(value) {
    this.isLoading = value;
  }

  setPouches(value) {
    this.pouches = value;
  }

  dropEntities() {
    this.setPouches([]);
  }

  constructor() {
    this.pouchLocalStorage = new LocalStorageItem('pouch');
    this.isLoading = true;
    this.isModalVisible = false;
    this.pouches = [];
  }

};
PouchStore = __decorate$j([Store()], PouchStore);

function asyncGeneratorStep$c(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$c(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$c(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$c(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$i = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$e = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$e = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let PouchService = class PouchService {
  loadPouches() {
    var _this = this;

    return _asyncToGenerator$c(function* () {
      _this.pouchStore.setPouches([]);

      const result = yield _this.pouchesAdapter.getPouches();

      if (result.isErr()) {
        // TODO: add error processing
        return;
      }

      _this.pouchStore.setPouches(result.getValue());
    })();
  }

  addPouch() {
    var _this = this;

    return _asyncToGenerator$c(function* () {
      const {
        isApplied,
        data
      } = yield _this.messageBoxService.prompt(t('pouchBlock.removeAsk'), '');
      if (!isApplied) return;
      const result = yield _this.pouchesAdapter.addPouch(data);
      if (result.isErr()) return;
      return result.getValue();
    })();
  }

  removePouch(pouchId) {
    var _this = this;

    return _asyncToGenerator$c(function* () {
      if (!pouchId) return false;
      const isConfirmed = yield _this.messageBoxService.confirm(t('pouchBlock.removeAsk'));
      if (!isConfirmed) return false;
      const result = yield _this.pouchesAdapter.removePouch(pouchId);
      if (result.isErr()) return false;
      return true;
    })();
  }

  selectPouch(pouchId) {
    var _this = this;

    return _asyncToGenerator$c(function* () {
      _this.pouchStore.setCurrentPouch(pouchId);
    })();
  }

  constructor(pouchesAdapter, pouchStore, messageBoxService) {
    this.pouchesAdapter = pouchesAdapter;
    this.pouchStore = pouchStore;
    this.messageBoxService = messageBoxService;
  }

};
PouchService = __decorate$i([Service(), __param$e(0, Inject()), __param$e(1, Inject()), __param$e(2, Inject()), __metadata$e("design:type", Function), __metadata$e("design:paramtypes", [typeof PouchesAdapter === "undefined" ? Object : PouchesAdapter, typeof PouchStore === "undefined" ? Object : PouchStore, typeof MessageBoxService === "undefined" ? Object : MessageBoxService])], PouchService);

function Portal({
  children
}) {
  const container = document.getElementById('portal');
  if (!container) return null;
  return /*#__PURE__*/e(d$1, {
    children: V( /*#__PURE__*/e(d$1, {
      children: children
    }), container)
  });
}

function useSearchLocation() {
  const [location, setLocation] = useLocation();
  return [location, setLocation, window.location.search];
}

const MODAL_PARAM_ID = 'modal';

function useModal({
  isVisible,
  onClose
}) {
  const [isContainerShown, setContainerShown] = y(isVisible);
  const idRef = s('');
  const prevStateRef = s(false);

  if (!idRef.current) {
    idRef.current = guid();
  }

  const [usedLocation, setLocation] = useSearchLocation();
  const hash = window.location.hash;
  const [basePath, searchLocation] = usedLocation.split('?');
  _(() => {
    // on mount
    const queryParams = new URLSearchParams(searchLocation);
    queryParams.set(MODAL_PARAM_ID, idRef.current);
    const newLocation = `${basePath}?${queryParams.toString()}`; // @ts-ignore

    setLocation(newLocation); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  _(() => {
    const searchFromHash = hash.split('?')[1] || '';
    const queryParams = new URLSearchParams(searchFromHash);
    const id = queryParams.get(MODAL_PARAM_ID);
    const isShown = id === idRef.current;
    const isStateChanged = prevStateRef.current !== isShown;
    prevStateRef.current = isShown;
    if (!isStateChanged) return;

    if (id) {
      setContainerShown(isShown);
      return;
    }

    onClose();
  }, [hash, onClose]);
  return {
    isContainerShown
  };
}

var modalStyles_m5w5et = '';

const Container$b = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cb00m8k"
});
const ContainerBg = /*#__PURE__*/styled$1("div")({
  name: "ContainerBg",
  class: "c18gl9yy"
});
const Overlay = /*#__PURE__*/styled$1("div")({
  name: "Overlay",
  class: "o1do1xz5"
});

function useModalHandleClose() {
  const handleClose = T$1(() => {
    history.go(-1);
  }, []);
  return {
    handleClose
  };
}

function ModalContainer({
  children,
  isVisible,
  onClose
}) {
  const {
    isContainerShown
  } = useModal({
    onClose,
    isVisible
  });
  const {
    handleClose
  } = useModalHandleClose();
  if (!isContainerShown) return null;
  return /*#__PURE__*/e(d$1, {
    children: /*#__PURE__*/e(Container$b, {
      children: [/*#__PURE__*/e(Overlay, {
        onClick: handleClose
      }), /*#__PURE__*/e(ContainerBg, {
        children: children
      })]
    })
  });
}

function Modal({
  children,
  isVisible,
  onClose
}) {
  if (!isVisible) return null;
  return /*#__PURE__*/e(Portal, {
    children: /*#__PURE__*/e(ModalContainer, {
      isVisible: isVisible,
      onClose: onClose,
      children: children
    })
  });
}

var MoneySpendingErrors;

(function (MoneySpendingErrors) {
  MoneySpendingErrors.GetExpensesResponse = createErrorClass('Failed load expenses');
  MoneySpendingErrors.UnexpectedErrorGetExpenses = createErrorClass('Unexpected load expenses');
  MoneySpendingErrors.GetCategoriesResponse = createErrorClass('Failed load categories');
  MoneySpendingErrors.UnexpectedErrorGetCategories = createErrorClass('Unexpected load categories');
  MoneySpendingErrors.RemoveExpenseResponse = createErrorClass('Failed remove expense');
  MoneySpendingErrors.UnexpectedErrorRemoveExpense = createErrorClass('Unexpected remove expense');
  MoneySpendingErrors.AddExpenseResponse = createErrorClass('Failed add expense');
  MoneySpendingErrors.UnexpectedErrorAddExpense = createErrorClass('Unexpected add expense');
})(MoneySpendingErrors || (MoneySpendingErrors = {}));

function asyncGeneratorStep$b(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$b(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$b(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$b(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$h = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let MoneySpendingDataProvider = class MoneySpendingDataProvider extends DatabaseDataProvider {
  getExpenses({
    offset,
    pouchId,
    limit
  }) {
    var _this = this;

    return _asyncToGenerator$b(function* () {
      const expenses = yield _this.client.expense.orderBy('time').reverse().filter(item => {
        if (item.dateEnd) return false;
        if (!pouchId && !item.pouchId) return true;
        if (item.pouchId === pouchId) return true;
        return false;
      }).offset(offset).limit(limit).toArray();
      return _this.ok(expenses);
    })();
  }

  getCategories() {
    var _this = this;

    return _asyncToGenerator$b(function* () {
      const categories = yield _this.client.category.toArray();
      return _this.ok(categories);
    })();
  }

  removeExpense(id) {
    var _this = this;

    return _asyncToGenerator$b(function* () {
      const fields = {
        dateEnd: Date.now()
      };

      const result = _this.client.expense.where('id').equals(id).modify(fields);

      return _this.ok(result);
    })();
  }

  addExpense(expense) {
    var _this = this;

    return _asyncToGenerator$b(function* () {
      _this.client.expense.add(expense);

      return _this.ok(true);
    })();
  }

};
MoneySpendingDataProvider = __decorate$h([DataProvider()], MoneySpendingDataProvider);

function asyncGeneratorStep$a(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$a(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$a(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$a(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$g = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$d = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$d = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let MoneySpendingAdapter = class MoneySpendingAdapter {
  getExpenses({
    pouchId,
    offset,
    limit
  }) {
    var _this = this;

    return _asyncToGenerator$a(function* () {
      try {
        const {
          error,
          data
        } = yield _this.moneySpendingDataProvider.getExpenses({
          offset,
          limit,
          pouchId
        });
        if (error) return dist.Result.Err(new MoneySpendingErrors.GetExpensesResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new MoneySpendingErrors.UnexpectedErrorGetExpenses(e));
      }
    })();
  }

  getCategories() {
    var _this = this;

    return _asyncToGenerator$a(function* () {
      try {
        const {
          error,
          data
        } = yield _this.moneySpendingDataProvider.getCategories();
        if (error) return dist.Result.Err(new MoneySpendingErrors.GetCategoriesResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new MoneySpendingErrors.UnexpectedErrorGetCategories(e));
      }
    })();
  }

  removeExpense(id) {
    var _this = this;

    return _asyncToGenerator$a(function* () {
      try {
        const {
          error,
          data
        } = yield _this.moneySpendingDataProvider.removeExpense(id);
        if (error) return dist.Result.Err(new MoneySpendingErrors.RemoveExpenseResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new MoneySpendingErrors.UnexpectedErrorRemoveExpense(e));
      }
    })();
  }

  addExpense({
    desc,
    cost,
    catId,
    pouchId
  }) {
    var _this = this;

    return _asyncToGenerator$a(function* () {
      try {
        const expense = {
          id: guid(),
          cost,
          desc,
          time: new Date().getTime(),
          state: -1,
          pouchId,
          catId
        };
        const {
          error,
          data
        } = yield _this.moneySpendingDataProvider.addExpense(expense);
        if (error) return dist.Result.Err(new MoneySpendingErrors.AddExpenseResponse(error));
        return dist.Result.Ok(data);
      } catch (e) {
        return dist.Result.Err(new MoneySpendingErrors.UnexpectedErrorAddExpense(e));
      }
    })();
  }

  constructor(moneySpendingDataProvider) {
    this.moneySpendingDataProvider = moneySpendingDataProvider;
  }

};
MoneySpendingAdapter = __decorate$g([Adapter(), __param$d(0, Inject()), __metadata$d("design:type", Function), __metadata$d("design:paramtypes", [typeof MoneySpendingDataProvider === "undefined" ? Object : MoneySpendingDataProvider])], MoneySpendingAdapter);

const LIMIT_DEFAULT = 50;

var __decorate$f = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let MoneySpendingStore = class MoneySpendingStore {
  get isShowMoreVisible() {
    return this.expenses.length >= LIMIT_DEFAULT;
  }

  get selectedParentCategory() {
    return this.categories.find(item => item.catId === this.selectedCategoryId);
  }

  get selectedCategory() {
    return this.categories.find(item => item.id === this.selectedCategoryId);
  }

  get isCalculatorVisible() {
    if (!this.selectedCategoryId) return false;
    return !this.selectedParentCategory;
  }

  get parentCategoryTitle() {
    if (!this.selectedCategoryId) return '';
    const category = this.selectedCategory;
    if (!category) return '';
    if (!category.catId) return category.title;

    if (category.catId) {
      const parentCategory = this.categories.find(item => item.id === category.catId);
      return (parentCategory === null || parentCategory === void 0 ? void 0 : parentCategory.title) || '';
    }

    return '';
  }

  get visibleCategories() {
    if (this.isCalculatorVisible) {
      const selectedCategory = this.selectedCategory;
      if (!selectedCategory) return [];
      return [selectedCategory];
    }

    return this.categories.filter(category => {
      if (category.catId === this.selectedCategoryId) return true;
      if (!this.selectedCategoryId && !category.catId) return true;
      return false;
    });
  }

  get isInitialLoading() {
    return this.offset === 0 && this.isLoading;
  }

  setSelectedCategoryId(id) {
    if (this.selectedCategoryId !== id) {
      this.selectedCategoryId = id;
      return;
    }

    const currentCategory = this.selectedCategory;
    this.selectedCategoryId = (currentCategory === null || currentCategory === void 0 ? void 0 : currentCategory.catId) || '';
  }

  setIsLoading(value) {
    this.isLoading = value;
  }

  setOffset(offset) {
    this.offset = offset;
  }

  setExpenses(value) {
    this.expenses = value;
  }

  addExpenses(value) {
    this.expenses = [...this.expenses, ...value];
  }

  setCategories(value) {
    this.categories = value;
  }

  removeExpenseById(id) {
    const index = this.expenses.findIndex(item => item.id === id);
    if (index === -1) return;
    this.expenses.splice(index, 1);
  }

  dropEntities() {
    this.setOffset(0);
    this.setExpenses([]);
    this.setCategories([]);
  }

  constructor() {
    this.offset = 0;
    this.selectedCategoryId = '';
    this.isLoading = true;
    this.expenses = [];
    this.categories = [];
  }

};
MoneySpendingStore = __decorate$f([Store()], MoneySpendingStore);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var __decorate$e = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let ExpenseSelectionStore = class ExpenseSelectionStore {
  clear() {
    this.currentCost = 0;
    this.costList = [];
    this.setFloat(false);
  }

  setFloat(value) {
    this.isFloat = value;
    this.floatCost = 0;
  }

  setFloatCost(value) {
    if (value < 100) {
      this.floatCost = value;
      return;
    }

    const str = String(value).slice(-2);
    this.floatCost = Number(str);
  }

  getNextCost(current, char) {
    return current * 10 + Number(char);
  }

  addNumberToCost(char) {
    if (this.isFloat) {
      const floatCost = this.getNextCost(this.floatCost, char);
      this.setFloatCost(floatCost);
      return;
    }

    const cost = this.getNextCost(this.currentCost, char);
    this.setCurrentCost(cost);
  }

  setCurrentCost(value) {
    this.currentCost = value;
  }

  setCurrentDesc(value) {
    this.currentDesc = value;
  }

  pushCurrentToCostList() {
    this.costList.push(this.currentCost * 100 + this.floatCost);
    this.currentCost = 0;
    this.setFloat(false);
  }

  removeLastFromCostList() {
    this.costList.pop();
    this.setFloat(false);
  }

  setCurrentExpenseView(value) {
    this.currentExpenseView = value ? _objectSpread({}, value) : null;
  }

  get isEditing() {
    return !!this.currentExpenseView;
  }

  get categoryId() {
    var ref;
    return (ref = this.currentExpenseView) === null || ref === void 0 ? void 0 : ref.catId;
  }

  get costsView() {
    return this.costList.map(item => getNumber(item / 100, 2)).join(' + ');
  }

  get totalCostView() {
    const total = this.costList.reduce((acc, item) => {
      return acc + item;
    }, this.currentCost * 100 + this.floatCost);
    return getNumber(total / 100);
  }

  get currentCostView() {
    if (this.isFloat) {
      const num = (this.currentCost * 100 + this.floatCost) * 10 / 1000 + 0.0001;
      return getNumber(num, 2);
    }

    return getNumber(this.currentCost);
  }

  getExpenses() {
    return [...this.costList, this.currentCost * 100 + this.floatCost];
  }

  dropData() {
    this.costList = [];
    this.currentCost = 0;
    this.isFloat = false;
    this.floatCost = 0;
    this.currentDesc = '';
  }

  constructor() {
    this.currentExpenseView = null;
    this.costList = [];
    this.currentCost = 0;
    this.isFloat = false;
    this.floatCost = 0;
    this.currentDesc = '';
  }

};
ExpenseSelectionStore = __decorate$e([Store()], ExpenseSelectionStore);

function asyncGeneratorStep$9(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$9(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$9(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$9(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$d = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$c = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$c = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let MoneySpendingService = class MoneySpendingService {
  initialLoadData() {
    var _this = this;

    return _asyncToGenerator$9(function* () {
      _this.moneySpendingStore.setExpenses([]);

      _this.moneySpendingStore.setOffset(0);

      const [categoriesResult] = yield Promise.all([_this.moneySpendingAdapter.getCategories(), _this.pouchService.loadPouches()]);

      if (categoriesResult.isErr()) {
        // TODO: add error processing
        return;
      }

      _this.moneySpendingStore.setCategories(categoriesResult.getValue());

      if (_this.moneySpendingStore.categories.length === 0) {
        // open empty settings
        _this.historyService.push(Routes.empty);

        return;
      }

      yield _this.loadExpenses(0);
    })();
  }

  reloadExpenses() {
    var _this = this;

    return _asyncToGenerator$9(function* () {
      _this.moneySpendingStore.setExpenses([]);

      _this.moneySpendingStore.setOffset(0);

      yield _this.loadExpenses(0);
    })();
  }

  loadExpenses(offset) {
    var _this = this;

    return _asyncToGenerator$9(function* () {
      const currentPouchId = _this.pouchStore.currentPouchId;
      const result = yield _this.moneySpendingAdapter.getExpenses({
        offset,
        pouchId: currentPouchId,
        limit: LIMIT_DEFAULT
      });

      if (result.isErr()) {
        // TODO: add error
        return;
      }

      _this.moneySpendingStore.setOffset(offset + LIMIT_DEFAULT);

      const nextExpenses = result.getValue();

      _this.moneySpendingStore.addExpenses(nextExpenses);
    })();
  }

  removeExpense(id) {
    var _this = this;

    return _asyncToGenerator$9(function* () {
      const isConfirmed = yield _this.messageBoxService.confirm(t('expense.confirmRemove'));
      if (!isConfirmed) return;

      _this.moneySpendingStore.setIsLoading(true);

      const result = yield _this.moneySpendingAdapter.removeExpense(id);

      _this.moneySpendingStore.setIsLoading(false);

      if (result.isErr()) {
        //TODO: add error processing
        return;
      }

      _this.moneySpendingStore.setOffset(_this.moneySpendingStore.offset - 1);

      _this.moneySpendingStore.removeExpenseById(id);

      _this.expenseSelectionStore.setCurrentExpenseView(null);
    })();
  }

  handleApply() {
    var _this = this;

    return _asyncToGenerator$9(function* () {
      _this.moneySpendingStore.setIsLoading(true);

      const pouchId = _this.pouchStore.currentPouchId;
      const catId = _this.moneySpendingStore.selectedCategoryId;
      const desc = _this.expenseSelectionStore.currentDesc;

      const newExpenses = _this.expenseSelectionStore.getExpenses(); // console.log('newExpenses', newExpenses)


      for (const cost of newExpenses) {
        yield _this.moneySpendingAdapter.addExpense({
          pouchId,
          catId,
          cost,
          desc
        }); // if (result.isErr()) {
        //   //TODO: add error processing
        //   return
        // }
      }

      _this.expenseSelectionStore.dropData();

      yield _this.reloadExpenses();

      _this.historyService.push(Routes.expense); // await this.initialLoadData()


      _this.moneySpendingStore.setIsLoading(false);
    })();
  }

  constructor(messageBoxService, moneySpendingStore, moneySpendingAdapter, expenseSelectionStore, pouchService, pouchStore, historyService) {
    this.messageBoxService = messageBoxService;
    this.moneySpendingStore = moneySpendingStore;
    this.moneySpendingAdapter = moneySpendingAdapter;
    this.expenseSelectionStore = expenseSelectionStore;
    this.pouchService = pouchService;
    this.pouchStore = pouchStore;
    this.historyService = historyService;
  }

};
MoneySpendingService = __decorate$d([Service(), __param$c(0, Inject()), __param$c(1, Inject()), __param$c(2, Inject()), __param$c(3, Inject()), __param$c(4, Inject()), __param$c(5, Inject()), __param$c(6, Inject()), __metadata$c("design:type", Function), __metadata$c("design:paramtypes", [typeof MessageBoxService === "undefined" ? Object : MessageBoxService, typeof MoneySpendingStore === "undefined" ? Object : MoneySpendingStore, typeof MoneySpendingAdapter === "undefined" ? Object : MoneySpendingAdapter, typeof ExpenseSelectionStore === "undefined" ? Object : ExpenseSelectionStore, typeof PouchService === "undefined" ? Object : PouchService, typeof PouchStore === "undefined" ? Object : PouchStore, typeof HistoryService === "undefined" ? Object : HistoryService])], MoneySpendingService);

function asyncGeneratorStep$8(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$8(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$8(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$8(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$c = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$b = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$b = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let PouchAction = class PouchAction {
  handleOpenPouchesList() {
    this.pouchStore.setModalVisible(true);
  }

  handleClosePouchesList() {
    this.pouchStore.setModalVisible(false);
  }

  handleRemove(pouchId) {
    var _this = this;

    return _asyncToGenerator$8(function* () {
      const isSame = pouchId === _this.pouchStore.currentPouchId;
      const isRemoved = yield _this.pouchService.removePouch(pouchId);
      if (!isRemoved) return;

      _this.moneySpendingStore.setIsLoading(true);

      yield _this.pouchService.loadPouches();

      _this.moneySpendingStore.setIsLoading(false);

      if (isSame) {
        yield _this.handleSelect(null);
      }
    })();
  }

  handleAdd() {
    var _this = this;

    return _asyncToGenerator$8(function* () {
      const newPouchId = yield _this.pouchService.addPouch();
      if (!newPouchId) return;

      _this.moneySpendingStore.setIsLoading(true);

      yield _this.pouchService.loadPouches();
      yield _this.handleSelect(newPouchId);

      _this.moneySpendingStore.setIsLoading(false);
    })();
  }

  handleSelect(pouchId) {
    var _this = this;

    return _asyncToGenerator$8(function* () {
      _this.moneySpendingStore.setIsLoading(true);

      yield _this.pouchService.selectPouch(pouchId);
      yield _this.moneySpendingService.reloadExpenses();

      _this.moneySpendingStore.setIsLoading(false);
    })();
  }

  constructor(pouchStore, pouchService, moneySpendingService, moneySpendingStore) {
    this.pouchStore = pouchStore;
    this.pouchService = pouchService;
    this.moneySpendingService = moneySpendingService;
    this.moneySpendingStore = moneySpendingStore;
  }

};
PouchAction = __decorate$c([Action(), __param$b(0, Inject()), __param$b(1, Inject()), __param$b(2, Inject()), __param$b(3, Inject()), __metadata$b("design:type", Function), __metadata$b("design:paramtypes", [typeof PouchStore === "undefined" ? Object : PouchStore, typeof PouchService === "undefined" ? Object : PouchService, typeof MoneySpendingService === "undefined" ? Object : MoneySpendingService, typeof MoneySpendingStore === "undefined" ? Object : MoneySpendingStore])], PouchAction);

const {
  useModuleContext: usePouchContext
} = hookContextFactory({
  pouchStore: PouchStore,
  pouchAction: PouchAction
});

var pouchItemStyles_1i6bhrb = '';

const Row$3 = /*#__PURE__*/styled$1("button")({
  name: "Row",
  class: "r1ula01y"
});
const Container$a = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cqvsgeu"
});
const IconWrapper$2 = /*#__PURE__*/styled$1("div")({
  name: "IconWrapper",
  class: "i1bw3fr"
});
const TitleWrapper = /*#__PURE__*/styled$1("div")({
  name: "TitleWrapper",
  class: "t9boept"
});
const ActionWrapper = /*#__PURE__*/styled$1("div")({
  name: "ActionWrapper",
  class: "auzp478"
});

function PouchItem({
  pouch,
  onRemove,
  isSelected,
  onSelect
}) {
  const handleRemove = T$1(() => {
    onRemove && onRemove(pouch.id);
  }, [onRemove, pouch]);
  const handleSelect = T$1(() => {
    onSelect(pouch.id);
  }, [onSelect, pouch.id]);
  return /*#__PURE__*/e(Container$a, {
    children: [/*#__PURE__*/e(Row$3, {
      onClick: handleSelect,
      children: [/*#__PURE__*/e(IconWrapper$2, {
        children: isSelected && /*#__PURE__*/e(Icon, {
          iconName: "wallet"
        })
      }), /*#__PURE__*/e(TitleWrapper, {
        children: pouch.name
      })]
    }), onRemove && /*#__PURE__*/e(ActionWrapper, {
      children: /*#__PURE__*/e(Button, {
        variant: "flat",
        onClick: handleRemove,
        children: /*#__PURE__*/e(Icon, {
          iconName: "cross"
        })
      })
    })]
  });
}

const PouchModalContent = observer(() => {
  const {
    pouchStore,
    pouchAction
  } = usePouchContext();
  const currentId = pouchStore.currentPouchId;
  return /*#__PURE__*/e("div", {
    children: [/*#__PURE__*/e(PouchItem, {
      isSelected: currentId === null,
      pouch: {
        name: t('export.pouchMain'),
        id: null
      },
      onSelect: pouchAction.handleSelect
    }), pouchStore.pouches.map(pouch => {
      return /*#__PURE__*/e(PouchItem, {
        isSelected: currentId === pouch.id,
        pouch: pouch,
        onRemove: pouchAction.handleRemove,
        onSelect: pouchAction.handleSelect
      }, `${pouch.id}-${pouch.name}`);
    }), /*#__PURE__*/e(Button, {
      onClick: pouchAction.handleAdd,
      children: t('pouchBlock.add')
    })]
  });
});

const PouchModal = observer(() => {
  const {
    pouchStore,
    pouchAction
  } = usePouchContext();
  return /*#__PURE__*/e(Modal, {
    onClose: pouchAction.handleClosePouchesList,
    isVisible: pouchStore.isModalVisible,
    children: /*#__PURE__*/e(PouchModalContent, {})
  });
});

var linkStyles_aqii0v = '';

const Container$9 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c67ods1"
});
const IconWrapper$1 = /*#__PURE__*/styled$1("div")({
  name: "IconWrapper",
  class: "i1o8p8ca"
});
const ContentWrapper = /*#__PURE__*/styled$1("div")({
  name: "ContentWrapper",
  class: "c1hxs3cb"
});

function Link({
  children,
  icon,
  onClick,
  isDisabled
}) {
  return /*#__PURE__*/e(Container$9, {
    onClick: onClick,
    disabled: isDisabled,
    children: [icon && /*#__PURE__*/e(IconWrapper$1, {
      children: /*#__PURE__*/e(Icon, {
        iconName: icon
      })
    }), /*#__PURE__*/e(ContentWrapper, {
      children: children
    })]
  });
}

const PouchSelection = observer(() => {
  const {
    pouchStore,
    pouchAction
  } = usePouchContext();
  return /*#__PURE__*/e(d$1, {
    children: /*#__PURE__*/e(Link, {
      icon: "wallet",
      onClick: pouchAction.handleOpenPouchesList,
      children: pouchStore.currentPouchName
    })
  });
});

addBlock({
  data: {
    pouchBlock: {
      modalTitle: ['Wallets', 'Кошельки'],
      add: ['Add Wallet', 'Добавить кошелек'],
      addTitle: ['New wallet', 'Новый кошелек'],
      removeAsk: ['Delete wallet permanently?', 'Удалить кошелек безвозвратно?']
    }
  }
});

function PouchBlock() {
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(PouchSelection, {}), /*#__PURE__*/e(PouchModal, {})]
  });
}

var expensesPageStyles_3m5f7r = '';

const LoadMoreWrapper = /*#__PURE__*/styled$1("div")({
  name: "LoadMoreWrapper",
  class: "l14jmizt"
});

function asyncGeneratorStep$7(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$7(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$7(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$7(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$b = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$a = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$a = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let MoneySpendingAction = class MoneySpendingAction {
  initialLoadData() {
    var _this = this;

    return _asyncToGenerator$7(function* () {
      if (_this.moneySpendingStore.offset !== 0) return;

      _this.moneySpendingStore.setIsLoading(true);

      yield _this.moneySpendingService.initialLoadData();

      _this.moneySpendingStore.setIsLoading(false);
    })();
  }

  handleLoadNextExpenses() {
    var _this = this;

    return _asyncToGenerator$7(function* () {
      _this.moneySpendingStore.setIsLoading(true);

      yield _this.moneySpendingService.loadExpenses(_this.moneySpendingStore.offset);

      _this.moneySpendingStore.setIsLoading(false);
    })();
  }

  handleOpenExpense() {
    this.historyService.push(Routes.expenseItem);
  }

  handleOpenExpenseList() {
    this.historyService.push(Routes.expense);
  }

  handleDropSelectedCategory() {
    this.moneySpendingStore.setSelectedCategoryId('');
  }

  constructor(moneySpendingService, moneySpendingStore, historyService) {
    this.moneySpendingService = moneySpendingService;
    this.moneySpendingStore = moneySpendingStore;
    this.historyService = historyService;
  }

};
MoneySpendingAction = __decorate$b([Action(), __param$a(0, Inject()), __param$a(1, Inject()), __param$a(2, Inject()), __metadata$a("design:type", Function), __metadata$a("design:paramtypes", [typeof MoneySpendingService === "undefined" ? Object : MoneySpendingService, typeof MoneySpendingStore === "undefined" ? Object : MoneySpendingStore, typeof HistoryService === "undefined" ? Object : HistoryService])], MoneySpendingAction);

var __decorate$a = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$9 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$9 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ExpensesViewStore = class ExpensesViewStore {
  get dateFormatter() {
    return new Intl.DateTimeFormat(this.langStore.currentLanguage, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  get dateYearFormatter() {
    return new Intl.DateTimeFormat(this.langStore.currentLanguage, {
      year: 'numeric',
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  get startTime() {
    const edgeDate = new Date();
    edgeDate.setHours(0, 0, 0, 0);
    return edgeDate.getTime();
  }

  get todayCost() {
    const startTime = this.startTime;
    const sum = this.moneySpendingStore.expenses.reduce((acc, expense) => {
      if (expense.time <= startTime) return acc;
      return acc + expense.cost;
    }, 0);
    return getMoney(sum);
  }

  get expensesView() {
    return this.mapExpenseToExpenseViewEntityList(this.moneySpendingStore.expenses, this.moneySpendingStore.categories);
  }

  mapExpenseToExpenseViewEntityList(expenseList, categoryList) {
    const categoryMap = {};
    categoryList.forEach(item => {
      categoryMap[item.id] = item;
    });
    return expenseList.map(expenseItem => {
      const catId = expenseItem.catId;
      const cat = categoryMap[catId];
      const parentCat = cat && cat.catId ? categoryMap[cat.catId] : null;
      return {
        id: expenseItem.id,
        catId: expenseItem.catId,
        cost: expenseItem.cost,
        pouchId: expenseItem.pouchId,
        time: expenseItem.time,
        state: expenseItem.state,
        dateBegin: expenseItem.dateBegin,
        dateEnd: expenseItem.dateEnd,
        desc: expenseItem.desc,
        catParentTitle: parentCat ? parentCat.title : '',
        catParentId: parentCat === null || parentCat === void 0 ? void 0 : parentCat.id,
        catTitle: cat ? cat.title : ''
      };
    });
  }

  getExpenseViewById(id) {
    return this.expensesView.find(item => item.id === id) || null;
  }

  constructor(langStore, moneySpendingStore) {
    this.langStore = langStore;
    this.moneySpendingStore = moneySpendingStore;
  }

};
ExpensesViewStore = __decorate$a([Store(), __param$9(0, Inject()), __param$9(1, Inject()), __metadata$9("design:type", Function), __metadata$9("design:paramtypes", [typeof LangStore === "undefined" ? Object : LangStore, typeof MoneySpendingStore === "undefined" ? Object : MoneySpendingStore])], ExpensesViewStore);

function asyncGeneratorStep$6(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$6(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$6(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$6(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$9 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$8 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$8 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ExpenseSelectionAction = class ExpenseSelectionAction {
  handleToggleSelectedExpense(id) {
    var ref;
    const nextId = ((ref = this.expenseSelectionStore.currentExpenseView) === null || ref === void 0 ? void 0 : ref.id) === id ? '' : id;

    if (!nextId) {
      this.expenseSelectionStore.setCurrentExpenseView(null);
      return;
    }

    const expense = this.expensesViewStore.getExpenseViewById(nextId);
    this.expenseSelectionStore.setCurrentExpenseView(expense);
  }

  handleRemoveExpense() {
    var _this = this;

    return _asyncToGenerator$6(function* () {
      var ref;
      const id = (ref = _this.expenseSelectionStore.currentExpenseView) === null || ref === void 0 ? void 0 : ref.id;
      if (!id) return;
      yield _this.moneySpendingService.removeExpense(id);
    })();
  }

  handleSelectCategoryId(id) {
    this.moneySpendingStore.setSelectedCategoryId(id);
  }

  handleDropSelectedCategory() {
    this.moneySpendingStore.setSelectedCategoryId('');
  }

  handleAddNumber(value) {
    this.expenseSelectionStore.addNumberToCost(value);
  }

  handlePushCost() {
    this.expenseSelectionStore.pushCurrentToCostList();
  }

  handlePopCost() {
    this.expenseSelectionStore.removeLastFromCostList();
  }

  handleClear() {
    this.expenseSelectionStore.clear();
  }

  handleChangeDesc(value) {
    this.expenseSelectionStore.setCurrentDesc(value);
  }

  handleSetFloat() {
    this.expenseSelectionStore.setFloat(true);
  }

  handleApply() {
    this.moneySpendingService.handleApply();
  }

  constructor(moneySpendingService, moneySpendingStore, expenseSelectionStore, expensesViewStore) {
    this.moneySpendingService = moneySpendingService;
    this.moneySpendingStore = moneySpendingStore;
    this.expenseSelectionStore = expenseSelectionStore;
    this.expensesViewStore = expensesViewStore;
  }

};
ExpenseSelectionAction = __decorate$9([Action(), __param$8(0, Inject()), __param$8(1, Inject()), __param$8(2, Inject()), __param$8(3, Inject()), __metadata$8("design:type", Function), __metadata$8("design:paramtypes", [typeof MoneySpendingService === "undefined" ? Object : MoneySpendingService, typeof MoneySpendingStore === "undefined" ? Object : MoneySpendingStore, typeof ExpenseSelectionStore === "undefined" ? Object : ExpenseSelectionStore, typeof ExpensesViewStore === "undefined" ? Object : ExpensesViewStore])], ExpenseSelectionAction);

const {
  useModuleContext: useMoneySpendingContext
} = hookContextFactory({
  moneySpendingAction: MoneySpendingAction,
  expenseSelectionAction: ExpenseSelectionAction,
  moneySpendingStore: MoneySpendingStore,
  expenseSelectionStore: ExpenseSelectionStore,
  expensesViewStore: ExpensesViewStore
});

var dot_ur8aht = '';

const Dot = /*#__PURE__*/styled$1("span")({
  name: "Dot",
  class: "d1e6vu4z"
});

var todayCostStyles_1ijec60 = '';

const Container$8 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "ch0zh0"
});
const Item$1 = /*#__PURE__*/styled$1("div")({
  name: "Item",
  class: "i1wfp9bw"
});
const Money$1 = /*#__PURE__*/styled$1("div")({
  name: "Money",
  class: "m12l9go9"
});

const TodayCost = observer(() => {
  const {
    expensesViewStore
  } = useMoneySpendingContext();
  return /*#__PURE__*/e(Container$8, {
    children: [/*#__PURE__*/e(Item$1, {
      children: t('expense.today')
    }), /*#__PURE__*/e(Item$1, {
      children: /*#__PURE__*/e(Money$1, {
        children: [expensesViewStore.todayCost, /*#__PURE__*/e(Dot, {})]
      })
    })]
  });
});

const isIntersectionAvailable = ('IntersectionObserver' in window);
function useIntersection({
  onChange
}) {
  const elementRef = s(null);
  const observerRef = s(null);
  const handleRef = s(onChange);
  handleRef.current = onChange;
  const anchorRef = T$1(node => {
    if (!isIntersectionAvailable) return;

    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
      observerRef.current.disconnect();
      observerRef.current = null;
      elementRef.current = null;
    }

    if (!node) return;
    elementRef.current = node;
    const observer = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        handleRef.current('visible');
        return;
      }

      handleRef.current('hidden');
    }, {
      root: null,
      threshold: 0.1
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);
  return {
    anchorRef,
    isIntersectionAvailable
  };
}

function useExpensesPage() {
  const {
    moneySpendingAction,
    moneySpendingStore
  } = useMoneySpendingContext();
  _(() => {
    moneySpendingAction.initialLoadData();
  }, [moneySpendingAction]);
  const handleChangeViewport = T$1(state => {
    if (state === 'hidden') return;
    moneySpendingAction.handleLoadNextExpenses();
  }, [moneySpendingAction]);
  const {
    anchorRef
  } = useIntersection({
    onChange: handleChangeViewport
  });
  return {
    anchorRef,
    moneySpendingStore,
    moneySpendingAction
  };
}

var controlsStyles_jgx9w4 = '';

const ButtonWrapper$1 = /*#__PURE__*/styled$1("div")({
  name: "ButtonWrapper",
  class: "b12gi3a1"
});
const Item = /*#__PURE__*/styled$1("div")({
  name: "Item",
  class: "itn3x8t"
});

const Controls = observer(() => {
  const {
    expenseSelectionStore,
    moneySpendingAction,
    expenseSelectionAction
  } = useMoneySpendingContext();
  const {
    isEditing
  } = expenseSelectionStore;
  return /*#__PURE__*/e(ButtonWrapper$1, {
    children: [/*#__PURE__*/e(Item, {
      children: isEditing && /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "trash",
        iconSize: "huge",
        onClick: expenseSelectionAction.handleRemoveExpense
      })
    }), /*#__PURE__*/e(Item, {
      children: isEditing && /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "edit-l",
        iconSize: "huge",
        onClick: moneySpendingAction.handleOpenExpense
      })
    }), /*#__PURE__*/e(Item, {
      children: !isEditing && /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "plus",
        iconSize: "huge",
        onClick: moneySpendingAction.handleOpenExpense
      })
    })]
  });
});

var expenseRowStyles_qxlb90 = '';

const Container$7 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1n9ew6p"
});
const LeftBlock = /*#__PURE__*/styled$1("div")({
  name: "LeftBlock",
  class: "lpodqfn"
});
const RightBlock = /*#__PURE__*/styled$1("div")({
  name: "RightBlock",
  class: "rjehuex"
});
const Title = /*#__PURE__*/styled$1("div")({
  name: "Title",
  class: "t1eyo0j5"
});
const SubTitle = /*#__PURE__*/styled$1("div")({
  name: "SubTitle",
  class: "sewrx7s"
});
const Money = /*#__PURE__*/styled$1("div")({
  name: "Money",
  class: "m12ygf5"
});
const DateTitle = /*#__PURE__*/styled$1("div")({
  name: "DateTitle",
  class: "d1ixlz7k"
});

function ExpenseRow({
  expenseView,
  isSelected,
  isScrollTo
}) {
  const {
    expensesViewStore
  } = useMoneySpendingContext();
  const date = new Date(expenseView.time);
  const now = new Date();
  const isSameYear = now.getFullYear() === date.getFullYear();
  const time = isSameYear ? expensesViewStore.dateFormatter.format(date) : expensesViewStore.dateYearFormatter.format(date);
  const hours = date.getHours();
  const rawMinutes = date.getMinutes();
  const minutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes;
  const isToday = expenseView.time >= expensesViewStore.startTime;
  const refEl = s(null);
  _(() => {
    if (!isScrollTo) return;
    if (!refEl.current) return;
    refEl.current.scrollIntoView({
      block: 'center',
      inline: 'center'
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/e(Container$7, {
    "data-is-selected": isSelected,
    ref: refEl,
    children: [/*#__PURE__*/e(LeftBlock, {
      children: [/*#__PURE__*/e(Title, {
        children: [expenseView.catParentTitle ? `${expenseView.catParentTitle} / ` : '', ' ', expenseView.catTitle]
      }), /*#__PURE__*/e(SubTitle, {
        children: expenseView.desc
      })]
    }), /*#__PURE__*/e(RightBlock, {
      children: [/*#__PURE__*/e(Money, {
        children: getMoney(expenseView.cost)
      }), /*#__PURE__*/e(DateTitle, {
        children: [time, " | ", hours, ":", minutes, isToday && /*#__PURE__*/e(Dot, {})]
      })]
    })]
  });
}

var expenseListStyles_3cw4ik = '';

const RowsContainer = /*#__PURE__*/styled$1("ul")({
  name: "RowsContainer",
  class: "r99b5x7"
});
const Row$2 = /*#__PURE__*/styled$1("li")({
  name: "Row",
  class: "r19ziniv"
});

const ExpenseList = observer(() => {
  var ref;
  const {
    expenseSelectionAction,
    expenseSelectionStore,
    expensesViewStore
  } = useMoneySpendingContext();
  const onClick = T$1(e => {
    const expenseId = getAttrFromElement(e.target, 'data-expense-id');
    if (!expenseId) return;
    expenseSelectionAction.handleToggleSelectedExpense(expenseId);
  }, [expenseSelectionAction]);
  const selectedId = (ref = expenseSelectionStore.currentExpenseView) === null || ref === void 0 ? void 0 : ref.id;
  const isFocusItem = F$1(() => {
    return !!selectedId; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/e(RowsContainer, {
    onClick: onClick,
    children: expensesViewStore.expensesView.map(expenseView => {
      const key = `${expenseView.id}-${expenseView.cost}-${expenseView.catParentTitle}-${expenseView.catTitle}`;
      const isSelected = expenseView.id === selectedId;
      const isScrollTo = isSelected && isFocusItem;
      return /*#__PURE__*/e(Row$2, {
        "data-expense-id": expenseView.id,
        children: /*#__PURE__*/e(ExpenseRow, {
          expenseView: expenseView,
          isSelected: isSelected,
          isScrollTo: isScrollTo
        })
      }, key);
    })
  });
});

addBlock({
  data: {
    expense: {
      loadMore: ['Load More...', 'Загрузить еще...'],
      today: ['Today', 'Сегодня'],
      empty: ['No expenses are here...', 'Трат еще пока нет'],
      confirmRemove: ['Are you sure want to remove?', 'Точно удалить трату?']
    }
  }
});

const ExpensesPage = observer(() => {
  const {
    anchorRef,
    moneySpendingStore,
    moneySpendingAction
  } = useExpensesPage();
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(ScrollContainer, {
      children: /*#__PURE__*/e(Swap, {
        is: moneySpendingStore.isInitialLoading,
        isSlot: /*#__PURE__*/e(Loader, {}),
        children: [/*#__PURE__*/e(TodayCost, {}), /*#__PURE__*/e(ExpenseList, {}), /*#__PURE__*/e("div", {
          ref: anchorRef
        }), moneySpendingStore.isShowMoreVisible && /*#__PURE__*/e(LoadMoreWrapper, {
          children: /*#__PURE__*/e(Link, {
            onClick: moneySpendingAction.handleLoadNextExpenses,
            children: t('expense.loadMore')
          })
        })]
      })
    }), /*#__PURE__*/e(Controls, {})]
  });
});

var expenseItemStyles_d6mup8 = '';

const ButtonWrapper = /*#__PURE__*/styled$1("div")({
  name: "ButtonWrapper",
  class: "b1j9gmw1"
});
const Block = /*#__PURE__*/styled$1("div")({
  name: "Block",
  class: "bhrg2ct"
});

var categoriesStyles_1iw4uo6 = '';

const Header = /*#__PURE__*/styled$1("div")({
  name: "Header",
  class: "h4kaban"
});
const CategoryTag = /*#__PURE__*/styled$1("button")({
  name: "CategoryTag",
  class: "copzitc",
  vars: {
    "copzitc-0": [props => props.isSelected ? 'var(--clr-primary-text)' : 'var(--clr-primary)']
  }
});

const Categories = observer(() => {
  const {
    moneySpendingStore,
    moneySpendingAction,
    expenseSelectionAction
  } = useMoneySpendingContext();
  const {
    selectedCategoryId
  } = moneySpendingStore;
  const isCategorySelected = !!selectedCategoryId;
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(Header, {
      children: /*#__PURE__*/e(Swap, {
        is: !isCategorySelected,
        isSlot: t('moneySpending.selectCategory'),
        children: /*#__PURE__*/e(Button, {
          iconName: "cross",
          iconSize: "big",
          variant: "flat",
          onClick: moneySpendingAction.handleDropSelectedCategory,
          children: moneySpendingStore.parentCategoryTitle
        })
      })
    }), moneySpendingStore.visibleCategories.map(category => {
      const isSelected = category.id === selectedCategoryId;
      return /*#__PURE__*/e(CategoryTag, {
        onClick: () => {
          expenseSelectionAction.handleSelectCategoryId(category.id);
        },
        isSelected: isSelected,
        children: category.title
      }, category.id);
    })]
  });
});

var inputStyles_frh1ky = '';

const Container$6 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1dz5pjj"
});

function Input$1({
  value,
  type = 'text',
  onChange
}) {
  const handleChange = T$1(ev => {
    const target = ev.target;
    onChange(target.value);
  }, [onChange]);
  return /*#__PURE__*/e(Container$6, {
    children: /*#__PURE__*/e("input", {
      type: type,
      value: value,
      onChange: handleChange
    })
  });
}

var descStyles_oz0q3r = '';

const Container$5 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "ct5s5ng"
});

const Desc = observer(() => {
  const {
    expenseSelectionAction,
    expenseSelectionStore
  } = useMoneySpendingContext();
  return /*#__PURE__*/e(Container$5, {
    children: /*#__PURE__*/e(Input$1, {
      value: expenseSelectionStore.currentDesc,
      onChange: expenseSelectionAction.handleChangeDesc
    })
  });
});

var padTitleStyles_14qva38 = '';

const Container$4 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1qibejp"
});
const TotalCost = /*#__PURE__*/styled$1("div")({
  name: "TotalCost",
  class: "t1kkz9bq"
});
const CurrentCost = /*#__PURE__*/styled$1("div")({
  name: "CurrentCost",
  class: "c1pr84dy"
});
const CostView = /*#__PURE__*/styled$1("div")({
  name: "CostView",
  class: "cr1s5fd"
});

const PadTitle = observer(() => {
  const {
    expenseSelectionStore
  } = useMoneySpendingContext();
  return /*#__PURE__*/e(Container$4, {
    children: [/*#__PURE__*/e(CostView, {
      children: expenseSelectionStore.costsView
    }), /*#__PURE__*/e(CurrentCost, {
      children: expenseSelectionStore.currentCostView
    }), /*#__PURE__*/e(TotalCost, {
      children: ["= ", expenseSelectionStore.totalCostView]
    })]
  });
});

var padBlockStyles_kxndoe = '';

const Container$3 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c5pb6z"
});
const Row$1 = /*#__PURE__*/styled$1("div")({
  name: "Row",
  class: "rs7rexa"
});
const PadButton = /*#__PURE__*/styled$1("button")({
  name: "PadButton",
  class: "pwrvat7",
  vars: {
    "pwrvat7-0": [props => props.widthFill === 'half' ? '50%' : '25%'],
    "pwrvat7-1": [props => {
      switch (props.viewType) {
        case 'secondary':
          return 'var(--clr-5)';

        case 'apply':
          return 'var(--clr-primary)';

        default:
          return 'var(--clr-3)';
      }
    }]
  }
});

function usePadBlock() {
  const {
    expenseSelectionAction
  } = useMoneySpendingContext();
  const handleClick = T$1(ev => {
    const target = ev.target;
    const action = getAttrFromElement(target, 'data-action');
    if (!action) return;

    if (!isNaN(Number(action))) {
      expenseSelectionAction.handleAddNumber(action);
      return;
    }

    switch (action) {
      case 'clear':
        expenseSelectionAction.handleClear();
        return;

      case 'backspace':
        expenseSelectionAction.handlePopCost();
        return;

      case 'plus':
        expenseSelectionAction.handlePushCost();
        return;

      case 'dot':
        expenseSelectionAction.handleSetFloat();
        return;

      case 'apply':
        expenseSelectionAction.handleApply();
        return;
    }
  }, [expenseSelectionAction]);
  return {
    handleClick
  };
}

const PadBlock = observer(() => {
  const {
    handleClick
  } = usePadBlock();
  return /*#__PURE__*/e(Container$3, {
    onClick: handleClick,
    children: [/*#__PURE__*/e(Row$1, {
      children: [/*#__PURE__*/e(PadButton, {
        "data-action": "1",
        children: "1"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "2",
        children: "2"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "3",
        children: "3"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "clear",
        viewType: "secondary",
        children: "C"
      })]
    }), /*#__PURE__*/e(Row$1, {
      children: [/*#__PURE__*/e(PadButton, {
        "data-action": "4",
        children: "4"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "5",
        children: "5"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "6",
        children: "6"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "backspace",
        viewType: "secondary",
        children: /*#__PURE__*/e(Icon, {
          iconName: "a-left",
          iconSize: "big"
        })
      })]
    }), /*#__PURE__*/e(Row$1, {
      children: [/*#__PURE__*/e(PadButton, {
        "data-action": "7",
        children: "7"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "8",
        children: "8"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "9",
        children: "9"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "plus",
        viewType: "secondary",
        children: /*#__PURE__*/e(Icon, {
          iconName: "plus",
          iconSize: "big"
        })
      })]
    }), /*#__PURE__*/e(Row$1, {
      children: [/*#__PURE__*/e(PadButton, {
        "data-action": "dot",
        children: "."
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "0",
        children: "0"
      }), /*#__PURE__*/e(PadButton, {
        "data-action": "apply",
        widthFill: "half",
        viewType: "apply",
        children: t('moneySpending.add')
      })]
    })]
  });
});

addBlock({
  data: {
    moneySpending: {
      selectCategory: ['Please select category', 'Выберите категорию'],
      add: ['Add', 'Добавить'],
      edit: ['Change', 'Изменить'],
      commentPh: ['refinement', 'уточнение']
    }
  }
});

const ExpenseItemPage = observer(() => {
  const {
    moneySpendingAction,
    expenseSelectionAction,
    moneySpendingStore
  } = useMoneySpendingContext();
  const {
    focusStore
  } = useFocusContext();
  _(() => {
    return () => {
      expenseSelectionAction.handleSelectCategoryId('');
    };
  }, [expenseSelectionAction]);
  return /*#__PURE__*/e(d$1, {
    children: [/*#__PURE__*/e(ScrollContainer, {
      children: [/*#__PURE__*/e(Categories, {}), moneySpendingStore.isCalculatorVisible && /*#__PURE__*/e(Block, {
        children: [/*#__PURE__*/e(Desc, {}), /*#__PURE__*/e(PadTitle, {}), /*#__PURE__*/e(PadBlock, {})]
      })]
    }), !focusStore.isTyping && /*#__PURE__*/e(ButtonWrapper, {
      children: /*#__PURE__*/e(Button, {
        shape: "circle",
        iconName: "a-left",
        iconSize: "huge",
        onClick: moneySpendingAction.handleOpenExpenseList
      })
    })]
  });
});

const moneySpendingRoutes = [{
  route: {
    path: Routes.expense
  },
  component: ExpensesPage,
  header: {
    title: () => t('pages.expense'),
    component: PouchBlock
  },
  withNavigation: true
}, {
  route: {
    path: Routes.expenseItem
  },
  component: ExpenseItemPage
}];

function asyncGeneratorStep$5(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$5(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$5(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$5(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$8 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$7 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$7 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let DropAllService = class DropAllService {
  dropData() {
    var _this = this;

    return _asyncToGenerator$5(function* () {
      const isConfirmed = yield _this.messageBoxService.confirm(t('settings.sureDrop'));
      if (!isConfirmed) return;
      const result = yield _this.settingsAdapter.dropData();

      if (result.isErr()) ;

      _this.dropRelatedStores();
    })();
  }

  dropRelatedStores() {
    this.categoriesStore.dropCategories();
    this.moneySpendingStore.dropEntities();
  }

  constructor(messageBoxService, settingsAdapter, categoriesStore, moneySpendingStore) {
    this.messageBoxService = messageBoxService;
    this.settingsAdapter = settingsAdapter;
    this.categoriesStore = categoriesStore;
    this.moneySpendingStore = moneySpendingStore;
  }

};
DropAllService = __decorate$8([Service(), __param$7(0, Inject()), __param$7(1, Inject()), __param$7(2, Inject()), __param$7(3, Inject()), __metadata$7("design:type", Function), __metadata$7("design:paramtypes", [typeof MessageBoxService === "undefined" ? Object : MessageBoxService, typeof SettingsAdapter === "undefined" ? Object : SettingsAdapter, typeof CategoriesStore === "undefined" ? Object : CategoriesStore, typeof MoneySpendingStore === "undefined" ? Object : MoneySpendingStore])], DropAllService);

function asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$4(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$7 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$6 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$6 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ImportFinService = class ImportFinService {
  static decompressFromBase64(data) {
    try {
      let str = lz.decompressFromBase64(data);

      if (!str) {
        str = data;
      }

      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  importFiles(files) {
    var _this = this;

    return _asyncToGenerator$4(function* () {
      if (!files || files.length === 0) return;
      const content = yield _this.fileService.readTextFile(files[0]);
      const result = ImportFinService.decompressFromBase64(content);
      if (!result) return;
      if (!result.dbVersion) return;
      if (!result.data) return;

      _this.dropAllService.dropRelatedStores();

      const importResult = yield _this.settingsAdapter.importData(result.data);

      if (importResult.isErr()) {
        yield _this.messageBoxService.alert(t('settings.importError'));
        return;
      }

      yield _this.messageBoxService.alert(t('settings.importDone')); //TODO: add reload data to pouch and all other pages
    })();
  }

  constructor(messageBoxService, fileService, settingsAdapter, dropAllService) {
    this.messageBoxService = messageBoxService;
    this.fileService = fileService;
    this.settingsAdapter = settingsAdapter;
    this.dropAllService = dropAllService;
  }

};
ImportFinService = __decorate$7([Service(), __param$6(0, Inject()), __param$6(1, Inject()), __param$6(2, Inject()), __param$6(3, Inject()), __metadata$6("design:type", Function), __metadata$6("design:paramtypes", [typeof MessageBoxService === "undefined" ? Object : MessageBoxService, typeof FileService === "undefined" ? Object : FileService, typeof SettingsAdapter === "undefined" ? Object : SettingsAdapter, typeof DropAllService === "undefined" ? Object : DropAllService])], ImportFinService);

function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$3(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$6 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$5 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$5 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ExportFinService = class ExportFinService {
  saveDbToFile(storeData) {
    var _this = this;

    return _asyncToGenerator$3(function* () {
      try {
        const str = JSON.stringify(storeData);
        const content = lz.compressToBase64(str);
        const now = new Date();
        const fileName = `coinote.${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.fin`;

        _this.fileService.saveToFile(fileName, content);
      } catch (e) {}
    })();
  }

  exportData() {
    var _this = this;

    return _asyncToGenerator$3(function* () {
      const result = yield _this.settingsAdapter.getAllData();

      if (result.isErr()) {
        yield _this.messageBoxService.alert(t('settings.exportError'));
        return;
      }

      const data = result.getValue();
      yield _this.saveDbToFile({
        dbVersion: 4,
        data,
        stats: {
          expenses: data.expense.length,
          cats: data.category.length,
          pouch: data.pouch.length
        }
      });
    })();
  }

  constructor(messageBoxService, fileService, settingsAdapter) {
    this.messageBoxService = messageBoxService;
    this.fileService = fileService;
    this.settingsAdapter = settingsAdapter;
  }

};
ExportFinService = __decorate$6([Service(), __param$5(0, Inject()), __param$5(1, Inject()), __param$5(2, Inject()), __metadata$5("design:type", Function), __metadata$5("design:paramtypes", [typeof MessageBoxService === "undefined" ? Object : MessageBoxService, typeof FileService === "undefined" ? Object : FileService, typeof SettingsAdapter === "undefined" ? Object : SettingsAdapter])], ExportFinService);

addBlock({
  data: {
    export: {
      pouchMain: ['Main', 'Основной'],
      headers: {
        rootCat: ['Main category', 'Основная категория'],
        cat: ['Sub category', 'Подкатегория'],
        desc: ['Description', 'Описание'],
        date: ['Date', 'Дата'],
        cost: ['Cost', 'Стоимость']
      }
    }
  }
});

var __decorate$5 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$4 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$4 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
const SEPARATOR = '\t';
let SheetsService = class SheetsService {
  static getFullNum(num) {
    return num < 10 ? `0${num}` : num;
  }

  getPouchesSheetsMap(data) {
    const pouchMap = {
      null: {
        id: null,
        name: t('export.pouchMain'),
        rows: []
      }
    };
    data.pouch.forEach(item => {
      if (!item.id) return;
      pouchMap[item.id] = {
        id: item.id,
        name: item.name,
        rows: []
      };
    });
    const expenseViewList = this.expenseViewStore.mapExpenseToExpenseViewEntityList(data.expense, data.category);
    expenseViewList.forEach(item => {
      const pouchId = item.pouchId;
      const list = pouchId ? pouchMap[pouchId] : null;

      if (list) {
        list.rows.push(item);
      }
    });
    return pouchMap;
  }

  getExpenseRows(rows) {
    return rows.map(item => {
      const cost = item.cost;
      const realCost = item.cost / 100;
      const mainCost = Math.floor(realCost);
      const subCost = `${cost - mainCost * 100}`;
      const titleCost = `${mainCost},${subCost}`;
      const time = new Date(item.time);
      const month = SheetsService.getFullNum(time.getMonth() + 1);
      const day = SheetsService.getFullNum(time.getDate());
      const mins = SheetsService.getFullNum(time.getMinutes());
      const secs = SheetsService.getFullNum(time.getSeconds());
      const timeVal = `${time.getFullYear()}-${month}-${day} ${time.getHours()}:${mins}:${secs},000`; // yyyy-MM-dd hh:mm:ss.000

      const row = [item.catParentTitle, item.catTitle, timeVal, item.desc, titleCost];
      return row.join(SEPARATOR);
    });
  }

  getSheets(data) {
    const pouchesSheetMap = this.getPouchesSheetsMap(data);
    const sheets = [];

    for (const key in pouchesSheetMap) {
      const pouch = pouchesSheetMap[key];
      const name = pouch.name;
      const pouchRow = this.getExpenseRows(pouch.rows);
      const firstRow = [t('export.headers.rootCat'), t('export.headers.cat'), t('export.headers.date'), t('export.headers.desc'), t('export.headers.cost')].join(SEPARATOR);
      pouchRow.push(firstRow);
      pouchRow.reverse();
      sheets.push({
        name,
        sheet: pouchRow.join('\n')
      });
    }

    return sheets;
  }

  constructor(expenseViewStore) {
    this.expenseViewStore = expenseViewStore;
  }

};
SheetsService = __decorate$5([Service(), __param$4(0, Inject()), __metadata$4("design:type", Function), __metadata$4("design:paramtypes", [typeof ExpensesViewStore === "undefined" ? Object : ExpensesViewStore])], SheetsService);

function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$2(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$4 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$3 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$3 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ExportCsvService = class ExportCsvService {
  static getFileName(name) {
    const now = new Date();
    const dayNow = now.getDate();
    const day = dayNow < 10 ? `0${dayNow}` : dayNow;
    const template = `coinote.${now.getFullYear()}-${now.getMonth() + 1}-${day}`;
    return `${template}.${name}.csv`;
  }

  exportData() {
    var _this = this;

    return _asyncToGenerator$2(function* () {
      const result = yield _this.settingsAdapter.getAllData();

      if (result.isErr()) {
        yield _this.messageBoxService.alert(t('settings.exportError'));
        return;
      }

      const data = result.getValue();

      const sheets = _this.sheetsService.getSheets(data);

      sheets.forEach(({
        sheet,
        name
      }) => {
        const fileName = ExportCsvService.getFileName(name);

        _this.fileService.saveToFile(fileName, sheet);
      });
    })();
  }

  constructor(messageBoxService, settingsAdapter, fileService, sheetsService) {
    this.messageBoxService = messageBoxService;
    this.settingsAdapter = settingsAdapter;
    this.fileService = fileService;
    this.sheetsService = sheetsService;
  }

};
ExportCsvService = __decorate$4([Service(), __param$3(0, Inject()), __param$3(1, Inject()), __param$3(2, Inject()), __param$3(3, Inject()), __metadata$3("design:type", Function), __metadata$3("design:paramtypes", [typeof MessageBoxService === "undefined" ? Object : MessageBoxService, typeof SettingsAdapter === "undefined" ? Object : SettingsAdapter, typeof FileService === "undefined" ? Object : FileService, typeof SheetsService === "undefined" ? Object : SheetsService])], ExportCsvService);

var __decorate$3 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let SettingsStore = class SettingsStore {
  setIsLoading(value) {
    this.isLoading = value;
  }

  constructor() {
    this.isLoading = false;
  }

};
SettingsStore = __decorate$3([Store()], SettingsStore);

function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$1(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate$2 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$2 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$2 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let SettingsAction = class SettingsAction {
  handleImportFiles(files) {
    var _this = this;

    return _asyncToGenerator$1(function* () {
      _this.settingsStore.setIsLoading(true);

      yield _this.importFinService.importFiles(files);

      _this.settingsStore.setIsLoading(false);
    })();
  }

  handleExportAsFin() {
    var _this = this;

    return _asyncToGenerator$1(function* () {
      _this.settingsStore.setIsLoading(true);

      yield _this.exportFinService.exportData();

      _this.settingsStore.setIsLoading(false);
    })();
  }

  handleExportAsCsv() {
    var _this = this;

    return _asyncToGenerator$1(function* () {
      _this.settingsStore.setIsLoading(true);

      yield _this.exportCsvService.exportData();

      _this.settingsStore.setIsLoading(false);
    })();
  }

  handleDropAllData() {
    var _this = this;

    return _asyncToGenerator$1(function* () {
      _this.settingsStore.setIsLoading(true);

      yield _this.dropAllService.dropData();

      _this.settingsStore.setIsLoading(false);
    })();
  }

  constructor(importFinService, exportFinService, exportCsvService, dropAllService, settingsStore) {
    this.importFinService = importFinService;
    this.exportFinService = exportFinService;
    this.exportCsvService = exportCsvService;
    this.dropAllService = dropAllService;
    this.settingsStore = settingsStore;
  }

};
SettingsAction = __decorate$2([Action(), __param$2(0, Inject()), __param$2(1, Inject()), __param$2(2, Inject()), __param$2(3, Inject()), __param$2(4, Inject()), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", [typeof ImportFinService === "undefined" ? Object : ImportFinService, typeof ExportFinService === "undefined" ? Object : ExportFinService, typeof ExportCsvService === "undefined" ? Object : ExportCsvService, typeof DropAllService === "undefined" ? Object : DropAllService, typeof SettingsStore === "undefined" ? Object : SettingsStore])], SettingsAction);

const {
  useModuleContext: useSettingsContext
} = hookContextFactory({
  settingsAction: SettingsAction,
  settingsStore: SettingsStore
});

// //autogenerated by /build-version.js PLEASE, DO NOT MODIFY!!!
const buildVersion = {
  appName: 'Coinote',
  version: '5.0.1',
  changeset: 'ab75e73632327b2240c3d9c0f4b231a5724ab1bf',
  buildTime: new Date(1657483836055)
};

var buildVersionStyles_1ys16xi = '';

const Container$2 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1g8bbbt"
});

const buildTime = buildVersion.buildTime;
const hash = buildVersion.changeset.substring(0, 6);
function BuildVersion() {
  return /*#__PURE__*/e(Container$2, {
    children: [/*#__PURE__*/e("div", {
      children: [t(`settings.version`), ": ", buildVersion.version, ' | ', hash || '']
    }), /*#__PURE__*/e("div", {
      children: [t('settings.build'), ":", ' ', `${buildTime.toLocaleTimeString()} | ${buildTime.toLocaleDateString()}`]
    })]
  });
}

var listBlockStyles_vp9rj8 = '';

const IconWrapper = /*#__PURE__*/styled$1("div")({
  name: "IconWrapper",
  class: "ijo8e0l"
});
const LastNode = /*#__PURE__*/styled$1("div")({
  name: "LastNode",
  class: "l19lr7d2"
});

function ListBlock({
  onClick,
  icon,
  title,
  children
}) {
  return /*#__PURE__*/e(List.Row, {
    onClick: onClick,
    children: [/*#__PURE__*/e(List.Cell, {
      isCentered: true,
      children: /*#__PURE__*/e(IconWrapper, {
        children: /*#__PURE__*/e(Icon, {
          iconName: icon
        })
      })
    }), /*#__PURE__*/e(List.Cell, {
      isFullwidth: true,
      children: title
    }), /*#__PURE__*/e(List.Cell, {
      children: /*#__PURE__*/e(LastNode, {
        children: children
      })
    })]
  });
}

var settingsStyles_1fiuzsi = '';

const LangSwitch = /*#__PURE__*/styled$1("div")({
  name: "LangSwitch",
  class: "lh5gplm"
});

var uploadButtonStyles_2vrjjq = '';

const Container$1 = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cgfi94f"
});
const Wrapper = /*#__PURE__*/styled$1("div")({
  name: "Wrapper",
  class: "wvv2y5w"
});
const Input = /*#__PURE__*/styled$1("input")({
  name: "Input",
  class: "i1el2ilh"
});

function UploadButton({
  children,
  onChange
}) {
  const handleChange = T$1(e => {
    const target = e.target;
    const files = target.files;
    onChange && onChange(files);
    target.value = '';
  }, [onChange]);
  return /*#__PURE__*/e(Container$1, {
    children: /*#__PURE__*/e(Wrapper, {
      children: [children, /*#__PURE__*/e(Input, {
        onChange: handleChange,
        type: "file"
      })]
    })
  });
}

var buttonsStyles_4z8wbz = '';

const DangerRow = /*#__PURE__*/styled$1("div")({
  name: "DangerRow",
  class: "dmctse5"
});
const Container = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "c1sdpjvm"
});

var rowBlockStyles_vp133y = '';

const Row = /*#__PURE__*/styled$1("div")({
  name: "Row",
  class: "rw90o2a"
});

function RowBlock({
  children,
  icon,
  onClick
}) {
  return /*#__PURE__*/e("div", {
    children: /*#__PURE__*/e(Row, {
      onClick: onClick,
      children: /*#__PURE__*/e(Link, {
        icon: icon,
        children: children
      })
    })
  });
}

const Buttons = observer(() => {
  const {
    settingsAction
  } = useSettingsContext();
  return /*#__PURE__*/e(Container, {
    children: [/*#__PURE__*/e(RowBlock, {
      icon: "upload",
      children: /*#__PURE__*/e(UploadButton, {
        onChange: settingsAction.handleImportFiles,
        children: t('settings.importFin')
      })
    }), /*#__PURE__*/e(RowBlock, {
      icon: "download",
      onClick: settingsAction.handleExportAsFin,
      children: t('settings.exportFin')
    }), /*#__PURE__*/e(RowBlock, {
      icon: "download",
      onClick: settingsAction.handleExportAsCsv,
      children: t('settings.exportCsv')
    }), /*#__PURE__*/e(DangerRow, {
      onClick: settingsAction.handleDropAllData,
      children: /*#__PURE__*/e(RowBlock, {
        icon: "trash",
        children: t('settings.dropAll')
      })
    })]
  });
});

addBlock({
  data: {
    settings: {
      version: ['Version', 'Версия'],
      build: ['Build', 'Сборка'],
      importDone: ['Data added, import done', 'Данные добавлены, импорт завершен'],
      importError: ['Import file error!', 'Ошибка при импорте'],
      importFin: ['Import as .fin', 'Импорт как .fin'],
      exportError: ['Export error', 'Ошибка при экспорте'],
      exportFin: ['Export as .fin', 'Экспорт как .fin'],
      exportCsv: ['Export as .csv', 'Экспорт как .csv'],
      sureDrop: ['All data will be lost! Are you sure?', 'Все данные будут утеряны! Точно все удалить?'],
      dropAll: ['Drop ALL', 'Удалить все'],
      theme: {
        dark: ['Night Mode', 'Ночной режим'],
        light: ['Light Mode', 'Дневной режим']
      },
      lang: {
        title: ['Language', 'Язык'],
        values: ['English', 'Русский']
      }
    }
  }
});

const Settings = observer(() => {
  const {
    themeStore,
    themeAction
  } = useThemeContext();
  const {
    langAction
  } = useLanguageContext();
  const {
    settingsStore
  } = useSettingsContext();
  return /*#__PURE__*/e(ScrollContainer, {
    children: [/*#__PURE__*/e(List, {
      children: [/*#__PURE__*/e(ListBlock, {
        onClick: themeAction.handleToggleTheme,
        icon: "moon",
        title: t('settings.theme.dark'),
        children: /*#__PURE__*/e(Toggle, {
          checked: themeStore.currentTheme === 'dark'
        })
      }), /*#__PURE__*/e(ListBlock, {
        onClick: langAction.handleChangeLanguage,
        icon: "translate",
        title: t('settings.lang.title'),
        children: /*#__PURE__*/e(LangSwitch, {
          children: t(`settings.lang.values`)
        })
      })]
    }), /*#__PURE__*/e(Buttons, {}), /*#__PURE__*/e(BuildVersion, {}), settingsStore.isLoading && /*#__PURE__*/e(BlockLoader, {})]
  });
});

const settingsRoutes = [{
  route: {
    path: Routes.settings
  },
  header: {
    title: () => t('pages.settings')
  },
  component: Settings,
  withHeader: true,
  withNavigation: true
}];

const routes = [...settingsRoutes, ...moneySpendingRoutes, ...categoriesRoutes, ...appRoutes];

var __decorate$1 = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata$1 = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param$1 = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let ScreensService = class ScreensService {
  handlerRegisterRoutes() {
    this.routesStore.addRoutes(routes);
  }

  constructor(routesStore) {
    this.routesStore = routesStore;
  }

};
ScreensService = __decorate$1([Service(), __param$1(0, Inject()), __metadata$1("design:type", Function), __metadata$1("design:paramtypes", [typeof RoutesStore === "undefined" ? Object : RoutesStore])], ScreensService);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var __decorate = globalThis && globalThis.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = globalThis && globalThis.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = globalThis && globalThis.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
let MainModule = class MainModule {
  start() {
    var _this = this;

    return _asyncToGenerator(function* () {
      return new Promise(resolve => {
        _this.screensService.handlerRegisterRoutes();

        _this.appModule.start();

        resolve();
      });
    })();
  }

  static getInstance() {
    return Container$n.get(MainModule);
  }

  constructor(screensService, appModule) {
    this.screensService = screensService;
    this.appModule = appModule;
  }

};
MainModule = __decorate([Module(), __param(0, Inject()), __param(1, Inject()), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof ScreensService === "undefined" ? Object : ScreensService, typeof AppModule === "undefined" ? Object : AppModule])], MainModule);

const instance = MainModule.getInstance();
instance.start();
