This is an example project of frontend architecture. Based on DDD/Hexagon/etc...

The main idea of this approach is to try to separate the dependencies of dataflow. And in this approach, it's not a big deal what frontend framework/library will be used here (I hope)

For example, we can drop UI part and create CLI in the same way, because UI just calls handlers from interface and subscribe to actions from it. No direct calls to server/database/etc.

All modules, instead of **UI** level is use `dependency injection` approach. This gives the ability to cover most of the code with tests and use the same structure of code.

Top level:

- Core. It's entities, value-objects, errors, enums, and etc types
- UI. It's **only** user interface without any logic. Components and all related of components
- Interface. It's more about logic and control of data structures with actions for UI
- Infra. It's external communication level. Like database/server/etc outside

---

Let's try to go deeper.

Let's try to go deeper.

**UI** - it's the presentation layer. Only components/markup/styling. This part only subscribes to store and call actions.

**Context hook** - Special layer for giving the ability to call actions and subscribe to store from UI to interface levels

**Store** - It's a reactive store based on MobX.

**Action** - Layer for declaring handlers and logic of callback. It's like useCallback from react

**Service** - Special layer for making grouped handlers. They can be called from any Action. It's more about isolated logic

**Adapter** - This layer is more about mapping external data to our core structures with handle errors

**Data-provider** - Special layer for wrapping a direct call to external service. For example `fetch` calls should be here, or database queries or graphql calls to the server.

---

See an example of how it works here: [https://dudiq.github.io/improved-lamp/](https://dudiq.github.io/improved-lamp/)

And code example in `./src` folder

Map of layer relations:
![Scheme](./scheme.png 'Scheme')
