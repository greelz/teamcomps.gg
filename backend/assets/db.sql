SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: champions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.champions (
    id integer NOT NULL,
    primeid integer NOT NULL,
    internalname text NOT NULL,
    prettyname text NOT NULL
);


ALTER TABLE public.champions OWNER TO postgres;

--
-- Name: doubles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doubles (
    primeid bigint NOT NULL,
    wins numeric,
    losses numeric
);


ALTER TABLE public.doubles OWNER TO postgres;

--
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    match_id text NOT NULL,
    winner1 integer,
    winner2 integer,
    winner3 integer,
    winner4 integer,
    winner5 integer,
    loser1 integer,
    loser2 integer,
    loser3 integer,
    loser4 integer,
    loser5 integer,
    queue_type integer,
    patch text
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    puuid text NOT NULL,
    latest_query_time timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: quads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quads (
    primeid bigint NOT NULL,
    wins numeric,
    losses numeric
);


ALTER TABLE public.quads OWNER TO postgres;

--
-- Name: quints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quints (
    primeid bigint NOT NULL,
    wins numeric,
    losses numeric
);


ALTER TABLE public.quints OWNER TO postgres;

--
-- Name: singles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.singles (
    primeid integer NOT NULL,
    wins numeric,
    losses numeric
);


ALTER TABLE public.singles OWNER TO postgres;

--
-- Name: triples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.triples (
    primeid bigint NOT NULL,
    wins numeric,
    losses numeric
);


ALTER TABLE public.triples OWNER TO postgres;

--
-- Name: matches Matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "Matches_pkey" PRIMARY KEY (match_id);


--
-- Name: champions champions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.champions
    ADD CONSTRAINT champions_pkey PRIMARY KEY (id);


--
-- Name: doubles doubles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doubles
    ADD CONSTRAINT doubles_pkey PRIMARY KEY (primeid);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (puuid);


--
-- Name: quads quads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quads
    ADD CONSTRAINT quads_pkey PRIMARY KEY (primeid);


--
-- Name: quints quints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quints
    ADD CONSTRAINT quints_pkey PRIMARY KEY (primeid);


--
-- Name: singles singles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.singles
    ADD CONSTRAINT singles_pkey PRIMARY KEY (primeid);


--
-- Name: triples triples_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.triples
    ADD CONSTRAINT triples_pkey PRIMARY KEY (primeid);
