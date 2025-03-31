import { useState } from "react";

import {
  Avatar,
  Burger,
  Button,
  Container,
  Grid,
  Group,
  MantineColor,
  Menu,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconPlus,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import cx from "clsx";

import classes from "./application.module.css";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

const tabs = ["Board", "Members", "Settings"];

export function Application() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <header className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          Brello
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                <Group gap={7}>
                  <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />}>
                Liked posts
              </Menu.Item>
              <Menu.Item leftSection={<IconStar size={16} color={theme.colors.yellow[6]} stroke={1.5} />}>
                Saved posts
              </Menu.Item>
              <Menu.Item leftSection={<IconMessage size={16} color={theme.colors.blue[6]} stroke={1.5} />}>
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>Account settings</Menu.Item>
              <Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>Change account</Menu.Item>
              <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>Logout</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>Pause subscription</Menu.Item>
              <Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5} />}>
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Board"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
          <Tabs.Panel value="Board">
            <Board />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </header>
  );
}

function Board() {
  return (
    <Container size="md" py="md">
      <Stack>
        <Group w="100%">
          <Text>Board</Text>
        </Group>
        <Grid grow gutter="md">
          <Grid.Col span={4}>
            <KanbanColumn title="To Do" color="teal.1" />
          </Grid.Col>
          <Grid.Col span={4}>
            <KanbanColumn title="In Progress" color="grape.1" />
          </Grid.Col>
          <Grid.Col span={4}>
            <KanbanColumn title="Done" color="gray.1" />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

function KanbanColumn({ title, color }: { title: string; color: MantineColor }) {
  return (
    <Paper p="md" bg={color} radius="md">
      <Title order={4} mb="md">
        {title}
      </Title>
      <Stack gap="xs">
        <KanbanCard />
        <KanbanCard />
        <KanbanCard />
        <KanbanCard />
        <KanbanCard />
        <Button fullWidth color={color.split(".").shift()} variant="light" mt="sm" leftSection={<IconPlus size={14} />}>
          Add card
        </Button>
      </Stack>
    </Paper>
  );
}

function KanbanCard() {
  return (
    <Paper p="md" shadow="xs">
      <Text>Card</Text>
    </Paper>
  );
}
