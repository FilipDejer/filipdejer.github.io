<?php

namespace App\Entity;

use App\Repository\KsiazkiRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: KsiazkiRepository::class)]
class Ksiazki
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Ksiazki = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $opis = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getKsiazki(): ?string
    {
        return $this->Ksiazki;
    }

    public function setKsiazki(string $Ksiazki): static
    {
        $this->Ksiazki = $Ksiazki;

        return $this;
    }

    public function getOpis(): ?string
    {
        return $this->opis;
    }

    public function setOpis(string $opis): static
    {
        $this->opis = $opis;

        return $this;
    }
}
