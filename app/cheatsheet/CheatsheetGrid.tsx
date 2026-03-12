"use client";

import { useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import styles from "./cheatsheet.module.css";

export type CheatsheetCard = {
  id: string;
  serviceName: string;
  icon: StaticImageData;
  groupColor: string;
  what: string;
  keyPoints: string[];
  trapPoints: string[];
  when: string;
};

export type CheatsheetGroup = {
  slug: string;
  name: string;
  color: string;
  cards: CheatsheetCard[];
};

type CheatsheetGridProps = {
  groups: CheatsheetGroup[];
};

const sectionLabelSx = {
  fontWeight: 700,
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

function renderList(items: string[], emptyLabel: string) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Box component="ul" sx={{ m: 0, pl: 2, display: "grid", gap: 0.5 }}>
      {items.map((item, index) => (
        <Box component="li" key={`${item}-${index}`} sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
          {item}
        </Box>
      ))}
    </Box>
  );
}

type FlipCardProps = {
  card: CheatsheetCard;
};

function FlipCard({ card }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    setFlipped((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      className={`${styles.card} ${styles.clickable}`}
      style={{ "--accent-color": card.groupColor } as CSSProperties}
    >
      <Box className={`${styles.inner} ${flipped ? styles.flipped : ""}`}>
        <Card
          className={styles.face}
          sx={{
            height: "100%",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 3,
            backgroundColor: "common.white",
            display: "flex",
          }}
        >
          <div className={styles.accent} />
          <CardContent sx={{ display: "grid", gap: 1.4, flex: 1 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Image src={card.icon} alt={`${card.serviceName} icon`} width={40} height={40} />
              <Typography variant="subtitle1" fontWeight={700}>
                {card.serviceName}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" noWrap title={card.what}>
              {card.what}
            </Typography>
          </CardContent>
        </Card>

        <Card
          className={`${styles.face} ${styles.back}`}
          sx={{
            height: "100%",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 3,
            backgroundColor: "common.white",
            display: "flex",
          }}
        >
          <div className={styles.accent} />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, display: "grid", gap: 1.2 }}>
              <Box>
                <Typography sx={sectionLabelSx} color="text.secondary">
                  What
                </Typography>
                <Typography variant="body2">{card.what}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography sx={sectionLabelSx} color="text.secondary">
                  Key
                </Typography>
                {renderList(card.keyPoints, "No key points listed.")}
              </Box>
              <Divider />
              <Box
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "warning.main",
                  backgroundColor: "warning.light",
                  p: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Chip label="Trap" size="small" color="warning" />
                </Stack>
                {renderList(card.trapPoints, "No traps listed.")}
              </Box>
            </Box>
            <Box>
              <Typography sx={sectionLabelSx} color="text.secondary">
                When
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {card.when}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default function CheatsheetGrid({ groups }: CheatsheetGridProps) {
  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" fontWeight={800} gutterBottom>
              SAA-C03 Cheat Sheet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Flip cards for rapid review. Click a card to reveal key details and traps.
            </Typography>
          </Box>

          {groups.map((group) => (
            <Box key={group.slug} sx={{ display: "grid", gap: 2.5 }}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {group.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {group.cards.length} services
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 2,
                }}
              >
                {group.cards.map((card) => (
                  <FlipCard key={card.id} card={card} />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
