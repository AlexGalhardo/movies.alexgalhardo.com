#!/bin/bash
bun install
bun run format
cp .env.example .env
bun run dev
