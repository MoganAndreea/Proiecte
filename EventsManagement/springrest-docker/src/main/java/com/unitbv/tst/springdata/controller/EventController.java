package com.unitbv.tst.springdata.controller;

import com.unitbv.tst.springdata.entity.Event;
import com.unitbv.tst.springdata.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    private final EventRepository eventRepository;

    // Constructor-based injection
    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Get all events
    @GetMapping
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    // Get an event by ID
    @GetMapping("/{id}")
    public Event getEvent(@PathVariable("id") Integer id) {
        return eventRepository.findById(id).orElseThrow();
    }

    // Save a new event
    @PostMapping
    public Event saveEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // Update an event by ID
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable("id") Integer id, @RequestBody Event event) {
        event.setId(id);
        return eventRepository.save(event);
    }

    // Delete an event by ID
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable("id") Integer id) {
        eventRepository.deleteById(id);
    }
}
