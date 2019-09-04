-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2019. Sze 04. 04:46
-- Kiszolgáló verziója: 5.7.25-0ubuntu0.18.04.2
-- PHP verzió: 7.2.10-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `food_delivery`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `MenuItems`
--

CREATE TABLE `MenuItems` (
  `id` int(11) UNSIGNED NOT NULL,
  `Category` varchar(120) NOT NULL DEFAULT '',
  `Description` varchar(255) DEFAULT '',
  `Name` varchar(120) NOT NULL DEFAULT '',
  `Price` int(4) NOT NULL,
  `Spicy` smallint(1) DEFAULT NULL,
  `Vegatarian` smallint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `MenuItems`
--

INSERT INTO `MenuItems` (`id`, `Category`, `Description`, `Name`, `Price`, `Spicy`, `Vegatarian`) VALUES
(1, 'Starter', 'Saláta csirkemellel, uborkával, pirított kenyérkockával', 'Cézár saláta', 700, 0, 0),
(2, 'Starter', 'Amerikai káposztasaláta', 'Coleslaw', 500, 0, 0),
(3, 'Starter', 'Tökmag pestoval', 'Tócsni', 750, 0, 1),
(4, 'Soup', 'Csigatésztával vagy májgaluskával', 'Húsleves', 800, 0, 0),
(5, 'Soup', 'Tejfölös csülkös', 'Bableves', 1000, 0, 0),
(6, 'Soup', 'Tejszínhabbal, erdei gyümölcsökkel', 'Gyümölcsleves', 1000, 0, 1),
(7, 'Soup', 'Pontyból, harcsából és busából', 'Halászlé', 1500, 1, 0),
(8, 'MainDish', 'Törtburgonyával', 'Pacalpörkölt', 1200, 0, 1),
(9, 'MainDish', 'Törtburgonyával', 'Pacalpörkölt', 1200, 0, 0),
(10, 'MainDish', '', 'Bécsi szelet', 2500, 0, 0),
(11, 'MainDish', 'Rizzsel, vagy hasábburgonyával', 'Rántott cukkini', 1500, 0, 1),
(12, 'MainDish', 'Galuskával', 'Marhapörkölt', 2500, 0, 1),
(13, 'Pizza', 'Paradicsomszósz, bazsalikom', 'Pizza Margherita', 1000, 0, 1),
(14, 'Pizza', 'Tonhalas, paradicsomos, mozzarellás', 'Pizza Tonno', 1500, 0, 0),
(15, 'Pizza', 'Négyféle sajttal', 'Pizza Quattro Formaggi', 2000, 0, 1),
(16, 'Pizza', 'Sonkával, pikáns szalámival, füstölt kolbásszal', 'Húsimádó Pizza', 2000, 1, 0),
(17, 'Dessert', '', 'Somlói galuska', 1000, 0, 0),
(18, 'Drink', NULL, 'Coca-Cola', 300, NULL, NULL),
(19, 'Drink', NULL, 'Ásványvíz', 300, NULL, NULL),
(20, 'Drink', NULL, 'Házi limonádé', 650, NULL, NULL),
(21, 'Drink', NULL, 'Red Bull', 700, NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Orders`
--

CREATE TABLE `Orders` (
  `id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Items` longtext NOT NULL,
  `Price` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Tel` varchar(20) NOT NULL,
  `Date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Sessions`
--

CREATE TABLE `Sessions` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Time` bigint(20) NOT NULL,
  `UserId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `MenuItems`
--
ALTER TABLE `MenuItems`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `Sessions`
--
ALTER TABLE `Sessions`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `MenuItems`
--
ALTER TABLE `MenuItems`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT a táblához `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT a táblához `Sessions`
--
ALTER TABLE `Sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT a táblához `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
