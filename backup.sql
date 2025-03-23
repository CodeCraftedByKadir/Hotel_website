--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    room_id integer,
    user_id integer,
    check_in date NOT NULL,
    check_out date NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    transaction_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO postgres;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(10) DEFAULT 'guest'::character varying,
    phone character varying(20),
    profile_picture character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, room_id, user_id, check_in, check_out, total_price, status, created_at) FROM stdin;
7	4	5	2025-02-20	2025-02-25	1250.00	cancelled	2025-02-20 14:56:44.15094
20	2	1	2025-02-21	2025-02-21	100.00	approved	2025-02-21 23:56:00.549961
21	2	1	2025-02-21	2025-02-22	100.00	approved	2025-02-21 23:57:00.591639
22	2	1	2025-02-21	2025-02-22	100.00	approved	2025-02-21 23:57:03.462159
27	3	8	2025-02-15	2025-02-23	100.00	approved	2025-02-22 00:58:09.936771
28	3	8	2025-02-23	2025-02-24	100.00	rejected	2025-02-22 00:58:19.086531
29	3	8	2025-02-22	2025-02-23	100.00	rejected	2025-02-22 00:59:19.825594
30	2	7	2025-02-21	2025-02-23	100.00	rejected	2025-02-22 08:36:09.546363
31	2	7	2025-02-22	2025-02-23	100.00	approved	2025-02-22 08:40:09.941047
32	2	7	2025-02-22	2025-02-23	100.00	approved	2025-02-22 08:40:33.820451
33	2	7	2025-02-22	2025-02-23	100.00	approved	2025-02-22 08:40:56.015131
34	9	7	2025-02-22	2025-02-23	100.00	approved	2025-02-22 08:41:13.536459
35	2	7	2025-02-22	2025-02-23	100.00	rejected	2025-02-22 08:42:15.257436
36	3	4	2025-02-28	2025-03-02	100.00	approved	2025-02-28 18:40:22.489132
43	7	4	2025-03-02	2025-03-09	100.00	approved	2025-02-28 19:39:41.920069
42	7	4	2025-03-02	2025-03-09	100.00	approved	2025-02-28 19:39:40.501124
41	7	4	2025-03-02	2025-03-09	100.00	approved	2025-02-28 19:39:38.017991
38	3	8	2025-02-28	2025-03-01	100.00	approved	2025-02-28 19:07:25.670782
39	10	8	2025-03-02	2025-03-02	100.00	approved	2025-02-28 19:07:35.527106
40	10	8	2025-03-02	2025-02-27	100.00	approved	2025-02-28 19:07:39.943824
45	6	4	2025-02-27	2025-03-01	100.00	approved	2025-02-28 20:00:51.508432
46	3	8	2025-02-27	2025-02-28	100.00	approved	2025-02-28 20:01:59.052575
47	3	8	2025-02-27	2025-02-28	100.00	approved	2025-02-28 20:02:00.503961
48	3	8	2025-02-27	2025-02-28	100.00	approved	2025-02-28 20:02:02.24628
73	2	4	2025-03-13	2025-03-14	180.00	pending	2025-03-13 09:46:04.694407
54	2	1	2025-03-11	2025-03-13	500.00	confirmed	2025-03-10 11:06:40.433512
58	5	4	2025-03-12	2025-03-13	100.00	pending	2025-03-11 12:57:03.030867
59	5	4	2025-03-12	2025-03-13	100.00	pending	2025-03-11 12:57:03.659539
60	5	4	2025-03-12	2025-03-13	100.00	pending	2025-03-11 12:57:04.042078
62	5	4	2025-03-12	2025-03-13	100.00	approved	2025-03-11 12:57:04.432586
61	5	4	2025-03-12	2025-03-13	100.00	approved	2025-03-11 12:57:04.246589
63	7	4	2025-03-15	2025-03-18	300.00	pending	2025-03-12 12:44:45.948529
64	5	4	2025-03-15	2025-03-18	750.00	pending	2025-03-12 12:45:15.409247
65	3	4	2025-03-15	2025-03-18	300.00	pending	2025-03-12 12:46:54.417096
5	3	6	2025-03-10	2025-03-15	750.00	approved	2025-02-20 14:56:11.224215
6	2	4	2025-04-05	2025-04-10	900.00	approved	2025-02-20 14:56:25.977494
74	2	4	2025-03-13	2025-03-14	180.00	pending	2025-03-13 10:01:23.7911
75	2	4	2025-03-13	2025-03-14	180.00	pending	2025-03-13 10:03:07.219117
76	2	4	2025-03-13	2025-03-14	180.00	pending	2025-03-13 10:03:11.413392
77	2	4	2025-03-13	2025-03-14	180.00	pending	2025-03-13 10:04:26.570421
79	2	7	2025-03-06	2025-03-14	1440.00	pending	2025-03-13 10:08:39.170133
80	2	7	2025-03-06	2025-03-14	1440.00	pending	2025-03-13 10:08:43.988927
49	3	8	2025-03-10	2025-03-11	100.00	confirmed	2025-03-10 06:24:45.059695
66	2	6	2025-03-20	2025-03-25	900.00	confirmed	2025-03-12 14:53:48.733383
67	2	4	2025-03-14	2025-03-15	180.00	pending	2025-03-13 09:44:05.737958
68	2	4	2025-03-14	2025-03-15	180.00	pending	2025-03-13 09:44:08.435678
78	2	4	2025-03-13	2025-03-14	180.00	confirmed	2025-03-13 10:04:28.428958
72	2	4	2025-03-13	2025-03-14	180.00	approved	2025-03-13 09:46:01.520514
87	8	4	2025-03-16	2025-03-17	500.00	pending	2025-03-16 11:09:55.868708
56	2	4	2025-03-12	2025-03-13	100.00	approved	2025-03-11 12:56:04.444922
71	2	4	2025-03-14	2025-03-15	180.00	approved	2025-03-13 09:44:10.638846
89	8	4	2025-03-16	2025-03-17	500.00	approved	2025-03-16 11:10:01.014286
90	4	8	2025-03-16	2025-03-17	500.00	pending	2025-03-16 11:10:53.064834
82	3	7	2025-03-11	2025-03-13	200.00	pending	2025-03-13 10:28:41.937684
83	2	47	2025-03-20	2025-03-25	900.00	pending	2025-03-13 10:47:58.066324
91	4	8	2025-03-16	2025-03-17	500.00	pending	2025-03-16 11:11:02.925221
55	2	4	2025-03-12	2025-03-13	100.00	approved	2025-03-11 12:56:03.374886
88	8	4	2025-03-16	2025-03-17	500.00	approved	2025-03-16 11:09:58.908869
81	2	4	2025-03-13	2025-03-14	180.00	confirmed	2025-03-13 10:27:09.693517
37	3	8	2025-02-28	2025-03-01	100.00	confirmed	2025-02-28 19:07:23.497318
57	2	4	2025-03-12	2025-03-13	100.00	approved	2025-03-11 12:56:04.867784
86	2	4	2025-03-07	2025-03-15	1440.00	confirmed	2025-03-14 12:20:10.426904
85	2	4	2025-03-07	2025-03-15	1440.00	confirmed	2025-03-14 12:20:07.454584
84	3	4	2025-03-13	2025-03-14	100.00	confirmed	2025-03-13 11:07:15.797561
69	2	4	2025-03-14	2025-03-15	180.00	confirmed	2025-03-13 09:44:09.175018
70	2	4	2025-03-14	2025-03-15	180.00	confirmed	2025-03-13 09:44:09.807239
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, user_id, amount, payment_status, transaction_id, created_at) FROM stdin;
1	4	900.00	pending	u8suyhg6nu	2025-03-12 12:51:14.248934
2	6	900.00	pending	tl6x75lwfs	2025-03-12 14:55:34.400436
3	6	900.00	paid	ktjetvzhxr	2025-03-12 14:55:38.274812
4	4	180.00	pending	feuphb6usu	2025-03-13 10:27:46.079336
5	4	180.00	pending	234nfj24qq	2025-03-13 11:07:51.208465
6	4	180.00	pending	4v0h1afcl8	2025-03-14 11:14:17.979675
7	4	180.00	pending	g3cwqfjbvj	2025-03-14 11:16:58.161835
8	4	180.00	pending	oakoev8eus	2025-03-14 11:16:59.056442
9	4	180.00	pending	hk9xsskmbp	2025-03-14 11:17:53.756722
10	4	180.00	pending	yf20kzxudy	2025-03-14 11:17:54.511056
11	4	100.00	pending	bdnnehp8dc	2025-03-14 11:18:54.884893
12	4	180.00	pending	0rmdgm76o8	2025-03-14 12:12:00.080361
13	4	180.00	pending	4ki9ohqihk	2025-03-14 12:12:00.959488
14	4	180.00	paid	8y5tivvxuo	2025-03-14 12:18:53.574086
16	4	1440.00	pending	kfuot6n3mh	2025-03-14 12:21:07.776046
15	4	1440.00	paid	zm20nto8gq	2025-03-14 12:21:07.006583
17	4	1440.00	pending	q8b5t2an1p	2025-03-14 12:31:32.822215
18	4	1440.00	pending	1j7vzyd6w9	2025-03-14 14:45:49.031586
19	4	1440.00	pending	vsplul3gum	2025-03-14 14:45:49.538471
20	4	1440.00	paid	tq4vcdlu9w	2025-03-14 14:51:18.209519
21	4	100.00	paid	bfneqqphwc	2025-03-14 14:56:37.037212
22	4	180.00	paid	wefbiq5s9t	2025-03-14 15:06:18.488952
23	4	180.00	paid	frkiyepjyp	2025-03-14 15:06:50.037211
24	8	100.00	paid	1muotb73qg	2025-03-14 16:37:55.060385
26	4	180.00	pending	vuaqplq25d	2025-03-16 11:09:09.847563
25	4	180.00	paid	n14yhbs48t	2025-03-16 11:09:08.240532
27	8	100.00	paid	fbal4r3p52	2025-03-20 12:27:41.28683
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, name, description, price, image_url, is_available, created_at) FROM stdin;
2	Executive Room	Spacious executive room with workspace and city view.	180.00	https://media.istockphoto.com/id/645682288/vector/bedroom-hotel-apartment-interior.jpg?s=612x612&w=0&k=20&c=HtmpuwCgHgrYoglxVXnsjvv7Lsr5mMQtlDAPL1ezPKk=	t	2025-02-20 14:18:42.327786
3	Standard Room	Comfortable standard room with all basic amenities.	100.00	https://media.istockphoto.com/id/522144432/photo/bedroom-interior-3d-rendering.jpg?s=612x612&w=0&k=20&c=wXy4-CW-Vje8W7IUc0w52_VRj88SVsZnTzw9I3Z00G4=	t	2025-02-20 14:18:42.327786
4	Presidential Suite	A five-star presidential suite with premium services.	500.00	https://media.istockphoto.com/id/176799643/photo/hotel-room.jpg?s=612x612&w=0&k=20&c=W0ieJyF3CCgJpUPUMK6YIAIdWQirLYtuKc_oH4YeybM=	t	2025-02-20 14:18:42.327786
5	Deluxe Suite	A luxurious suite with ocean view and king-sized bed.	250.00	https://media.istockphoto.com/id/645683356/vector/bedroom-hotel-apartment-interior.jpg?s=612x612&w=0&k=20&c=gCbQFd8LllvbOsTR98e_2z9oCyAHVxJJAnFRhgomYt8=	t	2025-02-20 14:18:43.433578
6	Executive Room	Spacious executive room with workspace and city view.	180.00	https://media.istockphoto.com/id/645682288/vector/bedroom-hotel-apartment-interior.jpg?s=612x612&w=0&k=20&c=HtmpuwCgHgrYoglxVXnsjvv7Lsr5mMQtlDAPL1ezPKk=	t	2025-02-20 14:18:43.433578
7	Standard Room	Comfortable standard room with all basic amenities.	100.00	https://media.istockphoto.com/id/522144432/photo/bedroom-interior-3d-rendering.jpg?s=612x612&w=0&k=20&c=wXy4-CW-Vje8W7IUc0w52_VRj88SVsZnTzw9I3Z00G4=	t	2025-02-20 14:18:43.433578
8	Presidential Suite	A five-star presidential suite with premium services.	500.00	https://media.istockphoto.com/id/176799643/photo/hotel-room.jpg?s=612x612&w=0&k=20&c=W0ieJyF3CCgJpUPUMK6YIAIdWQirLYtuKc_oH4YeybM=	t	2025-02-20 14:18:43.433578
9	Deluxe Suite	A luxurious suite with ocean view and king-sized bed.	250.00	https://media.istockphoto.com/id/645683356/vector/bedroom-hotel-apartment-interior.jpg?s=612x612&w=0&k=20&c=gCbQFd8LllvbOsTR98e_2z9oCyAHVxJJAnFRhgomYt8=	t	2025-02-20 14:18:44.540347
10	Executive Room	Spacious executive room with workspace and city view.	180.00	https://media.istockphoto.com/id/645682288/vector/bedroom-hotel-apartment-interior.jpg?s=612x612&w=0&k=20&c=HtmpuwCgHgrYoglxVXnsjvv7Lsr5mMQtlDAPL1ezPKk=	t	2025-02-20 14:18:44.540347
11	Standard Room	Comfortable standard room with all basic amenities.	100.00	https://media.istockphoto.com/id/522144432/photo/bedroom-interior-3d-rendering.jpg?s=612x612&w=0&k=20&c=wXy4-CW-Vje8W7IUc0w52_VRj88SVsZnTzw9I3Z00G4=	t	2025-02-20 14:18:44.540347
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, role, phone, profile_picture) FROM stdin;
6	Charlie Brown	charlie.brown@example.com	$2b$10$V4Cyx/ULpTzfouv5zDy1.ulwazIiKX5ki3zNmHpmzskTAYygPdxLu	2025-02-20 14:29:52.409289	guest	\N	\N
7	Emily Davis	emily.davis@example.com	$2b$10$ovPC8VydNY.n6Ylmr5/JXOUdS9m4zx.3odMSRNnM3TNEV7gopa6hm	2025-02-20 14:30:09.936667	guest	\N	\N
1	Test User	test@example.com	hashedpassword	2025-02-21 23:48:00.291877	guest	\N	\N
4	John Doe	johndoe@example.com	$2b$10$vZZIOTYUzNo/9gqS721dD.Gh50aLpenQlUl1IJDMHY/eBsVn6jqUa	2025-02-20 14:25:28.211737	admin	\N	\N
10	Admin User	admin@example.com	securepassword123	2025-02-25 09:06:57.648514	admin	\N	\N
11	Staff User	staff@example.com	securepassword456	2025-02-25 09:06:57.648514	staff	\N	\N
13	Franklin Harris	franklin.harris@example.com	$2b$10$ooe77NcZx8eFbjFW5kr8o.CzDISXI463LkA39f3YSCHmr9Bz3JqSu	2025-03-05 04:40:46.738028	staff	\N	\N
46	Grace Wilson	grace.wilson@example.com	$2b$10$/knQFTHVc.zrMVSyOaS76Ol5DoDZJ4fM.9hhjHFkovCEtHxQRelTq	2025-03-06 06:25:37.827851	customer	\N	\N
5	John Uploaded	john.uploaded@example.com	$2b$10$FOdPFwYjBU6ruDWNlGQ7eut4DzhxZFk2kYi2YJNz//TuP9nLchfya	2025-02-20 14:26:04.409987	staff	555-555-5555	/uploads/1741241111458-422682791.jpg
8	Abdulkadir ismail	abbzee959@gmail.com	$2b$10$cWxlt1RSr.SGNYrDRCOPVOOiJkhxQ0pd2F7W8JapdFlwt.zRQb/S.	2025-02-21 23:02:21.745714	staff	08066666666	/uploads/1741586306454-834663385.jpg
47	David Miller	david.miller@example.com	$2b$10$22/9riOMZd/jdRZeD1h/auIsSyrxzfHXDtbh4/SfYEkWT7X1PFaSS	2025-03-13 10:46:07.014323	staff	\N	\N
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 91, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 27, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 47, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

