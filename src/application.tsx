import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import cn from "clsx";
import { nanoid } from "nanoid";

import styles from "./application.module.css";
import { Button } from "./button";
import { containerStyles } from "./container";
import { customScrollStyles } from "./custom-scroll-styles";
import { Logo } from "./logo";
import { Textarea } from "./textarea";

type KanbanBoard = KanbanList[];

type KanbanList = {
  id: string;
  title: string;
  cards: KanbanCard[];
};

type KanbanCard = {
  id: string;
  title: string;
};

const INITIAL_BOARD: KanbanBoard = [
  {
    id: nanoid(),
    title: "To Do",
    cards: [
      { id: nanoid(), title: "Setup the Workplace" },
      { id: nanoid(), title: "Review opened issues" },
    ],
  },
  {
    id: nanoid(),
    title: "In Progress",
    cards: [{ id: nanoid(), title: "Implement Kanban feature" }],
  },
  {
    id: nanoid(),
    title: "Done",
    cards: [{ id: nanoid(), title: "Initialized project" }],
  },
];

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

export const Application = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Board />
      </main>
    </>
  );
};

function Header() {
  return (
    <header className={styles.header}>
      <nav className={cn(containerStyles, styles.nav)}>
        <Logo />
        <img className={styles.avatar} src={user.image} alt={user.name} />
      </nav>
    </header>
  );
}

function Board() {
  const [board] = useState<KanbanBoard>(INITIAL_BOARD);
  return (
    <section className={cn(containerStyles, styles.section)}>
      <header className={styles.headerSection}>
        <h1 className={styles.title}>Sprint #1</h1>
      </header>
      <DragDropContext onDragEnd={() => {}}>
        <div className={cn(styles.grid, customScrollStyles)}>
          {board.map((column) => (
            <KanbanColumn key={column.id} id={column.id} title={column.title} cards={column.cards} />
          ))}
        </div>
      </DragDropContext>
    </section>
  );
}

function KanbanColumn({ id, title, cards }: { id: string; title: string; cards: KanbanCard[] }) {
  return (
    <Droppable key={id} droppableId={id}>
      {(provided) => (
        <div ref={provided.innerRef} className={styles.column} {...provided.droppableProps}>
          <p className={styles.columnTitle}>{title}</p>
          <div className={styles.list}>
            {cards.map(({ id, title }, index) => (
              <KanbanCard key={id} id={id} index={index} title={title} />
            ))}
            {provided.placeholder}
            <form className={styles.form}>
              <Textarea onValue={() => {}} placeholder="Start making new card here" />
              <Button>Add card</Button>
            </form>
          </div>
        </div>
      )}
    </Droppable>
  );
}

function KanbanCard({ title, id, index }: { index: number; id: string; title: string }) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(styles.item, snapshot.isDragging ? styles.dragging : null)}
        >
          <p className={styles.itemText}>{title}</p>
        </div>
      )}
    </Draggable>
  );
}
