package com.unitbv.tst.springdata.controller;

import com.unitbv.tst.springdata.entity.Ticket;
import com.unitbv.tst.springdata.repository.TicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {
    private final TicketRepository ticketRepository;

    // Constructor-based injection
    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // Get all tickets
    @GetMapping
    public List<Ticket> getTickets() {
        return ticketRepository.findAll();
    }

    // Get a ticket by ID
    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable("id") Integer id) {
        return ticketRepository.findById(id).orElseThrow();
    }

    // Save a new ticket
    @PostMapping
    public Ticket saveTicket(@RequestBody Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    // Update a ticket by ID
    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable("id") Integer id, @RequestBody Ticket ticket) {
        ticket.setId(id);
        return ticketRepository.save(ticket);
    }

    // Delete a ticket by ID
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable("id") Integer id) {
        ticketRepository.deleteById(id);
    }
}
