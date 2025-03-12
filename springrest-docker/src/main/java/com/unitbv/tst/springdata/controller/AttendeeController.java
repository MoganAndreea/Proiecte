package com.unitbv.tst.springdata.controller;

import com.unitbv.tst.springdata.entity.Attendee;
import com.unitbv.tst.springdata.repository.AttendeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendees")
public class AttendeeController {
    private final AttendeeRepository attendeeRepository;

    // Constructor-based injection
    public AttendeeController(AttendeeRepository attendeeRepository) {
        this.attendeeRepository = attendeeRepository;
    }

    // Get all attendees
    @GetMapping
    public List<Attendee> getAttendees() {
        return attendeeRepository.findAll();
    }

    // Get an attendee by ID
    @GetMapping("/{id}")
    public Attendee getAttendee(@PathVariable("id") Integer id) {
        return attendeeRepository.findById(id).orElseThrow();
    }

    // Save a new attendee
    @PostMapping
    public Attendee saveAttendee(@RequestBody Attendee attendee) {
        return attendeeRepository.save(attendee);
    }

    // Update an attendee by ID
    @PutMapping("/{id}")
    public Attendee updateAttendee(@PathVariable("id") Integer id, @RequestBody Attendee attendee) {
        attendee.setId(id);
        return attendeeRepository.save(attendee);
    }

    // Delete an attendee by ID
    @DeleteMapping("/{id}")
    public void deleteAttendee(@PathVariable("id") Integer id) {
        attendeeRepository.deleteById(id);
    }
}
