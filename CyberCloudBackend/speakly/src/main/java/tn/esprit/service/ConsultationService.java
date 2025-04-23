package tn.esprit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entity.Consultation;
import tn.esprit.repository.ConsultationRepository;


import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }
    public Consultation addConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }


    public Consultation updateConsultation(Long id, Consultation newConsultation) {
        return consultationRepository.findById(id).map(consultation -> {
            consultation.setDetails(newConsultation.getDetails());
            consultation.setDescription(newConsultation.getDescription());
            consultation.setActualDuration(newConsultation.getActualDuration());
            return consultationRepository.save(consultation);
        }).orElse(null);
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

}

