-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 24, 2026 at 09:43 PM
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
  `user_id` int(11) NOT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `hotel` varchar(100) DEFAULT NULL,
  `room_type` varchar(50) DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `guests` int(11) DEFAULT NULL,
  `destinations` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Confirmed',
  `booked_on` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `transaction_id`, `hotel`, `room_type`, `check_in`, `check_out`, `guests`, `destinations`, `message`, `status`, `booked_on`) VALUES
(1, 1, 'RES-1782330097238', 'Catherine\'s Bagasbas Lighthouse Resort — Daet', 'Standard Room', '2026-06-25', '2026-06-25', 1, 'Bagasbas Beach', '', 'Confirmed', '6/25/2026');

-- --------------------------------------------------------

--
-- Table structure for table `trip_plans`
--

CREATE TABLE `trip_plans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `trip_name` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `travelers` int(11) DEFAULT NULL,
  `destination` varchar(100) DEFAULT NULL,
  `tourist_spots` text DEFAULT NULL,
  `transport_mode` varchar(50) DEFAULT NULL,
  `budget` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `submitted_on` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `gov_id` varchar(50) NOT NULL,
  `nationality` varchar(50) DEFAULT 'Filipino',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone`, `gov_id`, `nationality`, `created_at`) VALUES
(1, 'six seven', 'sixtyseven', 'sixseven@gmail.com', '$2y$10$Yhk5SSMBiZWGIVj32KHZd.HeV9FidWrp8tJew7cJU7UNVjcHkp1cS', '67', '67', 'Filipino', '2026-06-24 19:40:09');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `trip_plans`
--
ALTER TABLE `trip_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `trip_plans`
--
ALTER TABLE `trip_plans`
  ADD CONSTRAINT `trip_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
