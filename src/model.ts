import { createEvent, createStore } from "effector";

export const incrementClicked = createEvent();
export const $counter = createStore(0);

$counter.on(incrementClicked, (counter) => counter + 1);
