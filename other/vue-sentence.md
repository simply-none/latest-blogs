# vue sentences

Vue components require explicit props declaration **so that**(以便，为了) Vue knows **what** external props passed to the component should be treated as fallthrough attributes (which will be discused in its dedicated section).

Notice the argument passed to defineProps() is the same as the value provided to the props options: the same props options API is shared between the two declaration styles.

PascalCase, camelCase, kebab-case

when the parent property updates, it will flow down to the child, but not the other way around.

This is especially useful when developing a component that is intended(计划，打算) to be used by others.

However, there is an edge(优势，边，影响力，临界点) when both String and Boolean are allowed - the Boolean casting rule only applies if Boolean appears before String.

To add validation, the event is assigned(分配，指定，指派) a function that receives the arguments passed to the emit call and returns a boolean to indicate(指示，表明，指出) whether the event is valid or not.

Using props.onEvent has a different behaviour than using emit('event'), as the former will pass only handle the property based listener (either @event or :on-event). If both :onEvent and @event are passed props.onEvent might be an array of functions instead of function, this behavior is not stable and might change in the future.




input: text, textarea, value, input
input: radio, checkbox, checked, change
select, value, change

<input v-model="searchText"/>
<input :value="searchText" @input="searchText = $event.target.value"/>

<CustomInput :model-value="searchText" @update:model-value="newValue => searchText = newValue"/>
<input :value="props.modelValue" @input="$emit('update:modelValue', value)"/>

context: emits, attrs, slots, expose