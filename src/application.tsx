import { ReactElement, useEffect, useRef, useState } from "react";

import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import { ActionIcon, Group } from "@mantine/core";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
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
  const [board, setBoard] = useState<KanbanBoard>(INITIAL_BOARD);
  const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
    if (!destination) return;
    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    const isInsideTheSameColumn = sourceId === destinationId;
    if (isInsideTheSameColumn) {
      const column = board.find((column) => column.id === sourceId);
      if (column) {
        const reorderedList = listReorder(column, source.index, destination.index);
        const updatedBoard = board.map((column) => (column.id === sourceId ? reorderedList : column));
        setBoard(updatedBoard);
      }
    } else {
      const updatedBoard = cardMove(board, sourceId, destinationId, source.index, destination.index);
      setBoard(updatedBoard);
    }
  };

  function onCreateCard(card: KanbanCard, columnId: string) {
    const updatedBoard = board.map((column) => {
      if (column.id === columnId) {
        return { ...column, cards: [...column.cards, card] };
      }

      return column;
    });

    setBoard(updatedBoard);
  }

  function onColumnUpdate(updatedList: KanbanList) {
    const updatedBoard = board.map((column) => (column.id === updatedList.id ? updatedList : column));
    setBoard(updatedBoard);
  }

  return (
    <section className={cn(containerStyles, styles.section)}>
      <header className={styles.headerSection}>
        <h1 className={styles.title}>Sprint #1</h1>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={cn(styles.grid, customScrollStyles)}>
          {board.map((column) => (
            <KanbanColumn
              onUpdate={onColumnUpdate}
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
            >
              <KanbanCreateCard onCreate={(card) => onCreateCard(card, column.id)} />
            </KanbanColumn>
          ))}
        </div>
      </DragDropContext>
    </section>
  );
}

function cardMove(
  board: KanbanBoard,
  sourceColumnId: string,
  destinationColumnId: string,
  fromIndex: number,
  toIndex: number,
): KanbanBoard {
  const sourceColumnIndex = board.findIndex((column) => column.id === sourceColumnId);
  const destinationColumnIndex = board.findIndex((column) => column.id === destinationColumnId);

  const sourceColumn = board[sourceColumnIndex];
  const destinationColumn = board[destinationColumnIndex];
  const card = sourceColumn.cards[fromIndex];
  const updatedSourceColumn = { ...sourceColumn, cards: sourceColumn.cards.filter((_, index) => index !== fromIndex) };
  const updatedDestinationColumn = {
    ...destinationColumn,
    cards: [...destinationColumn.cards.slice(0, toIndex), { ...card }, ...destinationColumn.cards.slice(toIndex)],
  };

  return board.map((column) => {
    if (column.id === sourceColumnId) {
      return updatedSourceColumn;
    }
    if (column.id === destinationColumnId) {
      return updatedDestinationColumn;
    }
    return column;
  });
}

function listReorder(list: KanbanList, startIndex: number, endIndex: number): KanbanList {
  const cards = Array.from(list.cards);
  const [removed] = cards.splice(startIndex, 1);
  cards.splice(endIndex, 0, removed);

  return { ...list, cards };
}
function KanbanColumn({
  id,
  title,
  cards,
  children,
  onUpdate,
}: {
  id: string;
  title: string;
  cards: KanbanCard[];
  children?: ReactElement;
  onUpdate: (updateList: KanbanList) => void;
}) {
  function onCardEdit(updatedCard: KanbanCard) {
    const updatedCards = cards.map((card) => (card.id === updatedCard.id ? updatedCard : card));
    onUpdate({ id, title, cards: updatedCards });
  }

  function onCardDelete(cardId: string) {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    onUpdate({ id, title, cards: updatedCards });
  }
  return (
    <Droppable key={id} droppableId={id}>
      {(provided) => (
        <div ref={provided.innerRef} className={styles.column} {...provided.droppableProps}>
          <p className={styles.columnTitle}>{title}</p>
          <div className={styles.list}>
            {cards.map(({ id, title }, index) => (
              <KanbanCard
                onDelete={() => onCardDelete(id)}
                onEdit={onCardEdit}
                key={id}
                id={id}
                index={index}
                title={title}
              />
            ))}
            {provided.placeholder}
            {children}
          </div>
        </div>
      )}
    </Droppable>
  );
}

function KanbanCreateCard({ onCreate }: { onCreate: (card: KanbanCard) => void }) {
  const [title, setTitle] = useState("");

  function onReset() {
    setTitle("");
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    onCreate({ id: nanoid(), title });
    onReset();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Textarea variant="md" value={title} onValue={setTitle} placeholder="Start making new card here" />
      <Button type="submit">Add card</Button>
    </form>
  );
}

function KanbanCard({
  title,
  id,
  index,
  onEdit,
  onDelete,
}: {
  index: number;
  id: string;
  title: string;
  onEdit: (card: KanbanCard) => void;
  onDelete: () => void;
}) {
  const [editTitle, setEditTitle] = useState(title);
  const [editMode, setEditMode] = useState(false);

  function onReset() {
    setEditTitle(title);
    setEditMode(false);
  }

  function onEditFinished() {
    onEdit({ id, title: editTitle });
    onReset();
  }
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (editMode && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.selectionStart = el.selectionEnd = el.value.length;
    }
  }, [editMode]);

  if (editMode) {
    return (
      <div className={styles.item}>
        <Textarea ref={textareaRef} variant="md" value={editTitle} onValue={setEditTitle} />
        <Group>
          <ActionIcon onClick={onEditFinished}>
            <IconCheck size={14} />
          </ActionIcon>
          <ActionIcon onClick={onReset}>
            <IconX size={14} />
          </ActionIcon>
        </Group>
      </div>
    );
  }
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
          <Group>
            <ActionIcon onClick={() => setEditMode(true)}>
              <IconPencil size={14} />
            </ActionIcon>
            <ActionIcon onClick={() => onDelete()}>
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        </div>
      )}
    </Draggable>
  );
}
