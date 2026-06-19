-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 19, 2026 at 03:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `camnorte_tourism`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text NOT NULL,
  `sent_on` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `transaction_id`, `name`, `email`, `subject`, `message`, `sent_on`) VALUES
(1, 'MSG-1781873766252', 'Dela Cruz, Andrei Steven', 'ndrstvndlcrz0512@gmail.com', 'General Inquiry', 'yall got one million chinitas', '6/19/2026');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gov_id` varchar(50) DEFAULT NULL,
  `guests` int(11) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `hotel` varchar(150) NOT NULL,
  `room_type` varchar(100) DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `destinations` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Confirmed',
  `booked_on` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `transaction_id`, `first_name`, `last_name`, `email`, `phone`, `gov_id`, `guests`, `nationality`, `hotel`, `room_type`, `check_in`, `check_out`, `destinations`, `message`, `status`, `booked_on`) VALUES
(1, 'RES-1781873486362', 'Andrei Steven', 'Dela Cruz', 'ndrstvndlcrz0512@gmail.com', '+639277414889', '123456789', 1, 'Filipino', 'Mercedes Beachfront Resort — Mercedes', 'Suite', '2026-07-13', '2026-07-19', 'Mercedes Islands, Bantayog ni Rizal, Black Nazarene', 'one million soft girl', 'Confirmed', '6/19/2026');

-- --------------------------------------------------------

--
-- Table structure for table `trip_plans`
--

CREATE TABLE `trip_plans` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `travel_date` date NOT NULL,
  `travelers` int(11) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `destinations` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `submitted_on` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trip_plans`
--

INSERT INTO `trip_plans` (`id`, `transaction_id`, `name`, `email`, `travel_date`, `travelers`, `duration`, `budget`, `destinations`, `notes`, `status`, `submitted_on`) VALUES
(1, 'TRP-1781873567444', 'Andrei Steven Dela Cruz', 'ndrstvndlcrz0512@gmail.com', '2026-07-13', 1, '1 Week', 'Budget (₱1,000–₱3,000/day)', 'Mercedes Islands, Parola Island, Heritage Sites', 'one million soft girl na chinita', 'Pending', '6/19/2026');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trip_plans`
--
ALTER TABLE `trip_plans`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `trip_plans`
--
ALTER TABLE `trip_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
