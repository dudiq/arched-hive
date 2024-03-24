# Intro

`Arched Hive` - is a proposed approach for organizing a frontend application based on DDD, Hexagon, and other similar practices.

With example [https://dudiq.github.io/arched-hive/](https://dudiq.github.io/improved-lamp/)

See this monorepo source code to understand, how to implement this approach

Map of layer relations:

![Scheme](scheme/basic.png 'Basic scheme')

This approach aims to separate the flow of data dependencies, making it easy to switch
between frontend frameworks or even create a CLI instead.
The `UI` is designed to call handlers from the interface and subscribe to actions without
making direct calls to the server or database.

## Levels

Top level:

- `Core`. It's entities, value-objects, errors, enums, and etc types
- `UI`. This is just the user interface layer, which **only** handles components and their related functionality. It should not contain any business logic. If you need to include some logic, it should be encapsulated within actions.
- `Interface`. This part of the application focuses on managing the logic and control of data structures through UI actions. It serves as the main point of interaction with other modules in the system.
- `Infra`. This level is responsible for handling external communication with services such as databases, servers, and other modules. It acts as an interface between the module and the outside world. Other modules cannot access this level directly, and instead, they use services or actions to access the infrastructure.

---

Let's try to go deeper.

**UI** - This layer is responsible for the user interface presentation, including components, markup, and styling.
Its role is to subscribe to the store and call actions, without containing any business logic.

**Context hook** - This layer acts as a bridge between the presentation layer (UI) and the application logic.
Its main purpose is to provide the necessary functionality to allow the UI to call actions and subscribe to changes in the store, without directly accessing the application logic.
This is just an ordinary hook to give the ability to get an instance of classes for `UI` level from `Interface`

**Store** - The reactive store is a type of state management system based on MobX. Should be sync. Store should not have any async methods with logic. All async methods should be inside `Action`

**Action** - This layer is responsible for defining the handlers and the logic of the callbacks that are invoked when certain events occur.
It is similar to the useCallback hook in React, where you define a function that you want to memoize and pass it down to a child component to avoid unnecessary re-renders. In this layer, you define the functions that should be called when specific actions are dispatched to the store, and you can also define any other business logic that should be executed as a result of the action.

**Adapter** - This layer is responsible for handling data mapping and error handling while communicating with external services such as databases or APIs.
It ensures that the data received from external sources is properly mapped to the core structures of the application and handles any errors that may occur during the process.

**Data-provider** - This layer is responsible for providing a unified and controlled way to interact with external services or APIs. It provides an abstraction over the specific details of the service or API, allowing the rest of the application to interact with it in a standardized way.
By isolating the direct calls to external services within this layer, it becomes easier to manage and test these interactions. This layer can also handle things like error handling and response parsing, making it easier for the rest of the application to consume the data returned from the service.
Examples of external services that may be wrapped in this layer include REST APIs, GraphQL APIs, databases, and third-party libraries.
For simplify `Data-provider` can be part of `Adapter`

---

## How to organize modules.

Consider each module as a standalone npm package and organize the logic accordingly.
This approach reduces the interdependence between modules and improves the maintainability of the codebase.

### Cycle dep module

If you have a circular dependency between modules, it can indicate that there is a design issue in the way the modules are structured.
One way to solve this issue is to create a new module that defines the shared logic between the modules and then import the needed modules separately.
This can help break the circular dependency and provide a more modular and maintainable codebase.

For example, suppose you have Module A and Module B that both depend on each other.
To break the circular dependency, you can create a new Module C that defines the shared logic between the two modules.
Then, Module A and Module B can both import and use Module C without depending on each other directly.

Here's an example:

```javascript
// Module A
import { sharedLogic } from './moduleC'

export function doSomething() {
  // use sharedLogic here
}

// Module B
import { sharedLogic } from './moduleC'

export function doSomethingElse() {
  // use sharedLogic here
}

// Module C
import { doSomething } from './moduleA'
import { doSomethingElse } from './moduleB'

export const sharedLogic = {
  doSomething,
  doSomethingElse,
}
```

In this example, Module A and Module B both depend on shared logic provided by Module C. Instead of importing each other directly, they import and use shared logic from Module C.
This helps break the circular dependency between Module A and Module B and provides a more modular and maintainable codebase.

![Scheme](scheme/modules-relation.png 'Modules relation')
