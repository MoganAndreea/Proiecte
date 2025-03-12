package com.unitbv.tst.springdata.repository;

import com.unitbv.tst.springdata.entity.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendeeRepository extends JpaRepository<Attendee, Integer> {
}
