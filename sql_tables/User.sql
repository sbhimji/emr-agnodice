CREATE TABLE IF NOT EXISTS public."Users"
(
    first_name character varying(40) COLLATE pg_catalog."default",
    last_name character varying(40) COLLATE pg_catalog."default",
    username character varying(20) COLLATE pg_catalog."default",
    password character varying(100) COLLATE pg_catalog."default",
    email character varying(45) COLLATE pg_catalog."default",
    role character varying(20) COLLATE pg_catalog."default"
)
