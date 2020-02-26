import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'

export default class HelpPl extends React.Component {

  static getHeader() {
    return 'Pomoc'
  }

  render() {
    return (
      <PanelGroup accordion id="help-pl-accordion">
        <Panel key={1} eventKey={1}>
          <Panel.Heading>
            <Panel.Title toggle>Skąd pochodzi treść lotnicza?</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            Informacje na temat przestrzeni oraz lotnisk mamy dzięki uprzejmości zespołu <a target="_blank" href="http://lotnik.org/pliki.php">lotnik.org</a>.
            Aktualizowane są automatycznie kilka razy na dobę.
          </Panel.Body>
        </Panel>
        <Panel key={2} eventKey={2}>
          <Panel.Heading>
            <Panel.Title toggle>Czy konto w google/facebook jest niezbędne do korzystania z serwisu</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            Nie. Przygotowanie trasy oraz wydruk planu lotu nie wymagają logowania.
            Wspomniane konto jest niezbędne jedynie w celu zapisania planów lotu i dostępu do nich w późniejszym terminie.
          </Panel.Body>
        </Panel>
        <Panel key={3} eventKey={3}>
          <Panel.Heading>
            <Panel.Title toggle>Czym się różni aktualna wersja serwisu od starego lecimy.org?</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            W porównaniu z poprzednią wersją serwisu wprowadzono następujące zmiany:
            <ul>
              <li>Automatyczna aktualizacja treści lotniczej</li>
              <li>Automatyczne uwzględnienie deklinacji magnetycznej</li>
              <li>Angielska wersja językowa</li>
              <li>Ulepszona edycja trasy</li>
              <li>Dokładniejsze obliczenia nawigacyjne (trygonometria sferyczna)</li>
              <li>Nowoczesne technologie pozwalające na łatwiejszy rozwój i utrzymanie</li>
            </ul>
            Kilka z funkcjonalności dawnego serwisu nie zostało przeniesionych
            <ul>
              <li>Pobieranie pogody ze stron IMGW</li>
              <li>Uwzględnianie w obliczeniach czasu spędzonego nad punktami zwrotnymi</li>
            </ul>
            Jeśli użytkownicy wyrażą zapotrzebowanie (a autor będzie dysponował czasem), zostaną one dodane w kolejnych wersjach.
          </Panel.Body>
        </Panel>
        <Panel key={4} eventKey={4}>
          <Panel.Heading>
            <Panel.Title toggle>Znalazłem błąd, gdzie mogę go zgłosić?</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            Błędy oraz zapotrzebowanie na nowe funkcjonalności można zgłaszać na adres mailowy autora serwisu: bwilczek@gmail.com
            <br /><br />
            Użytkownicy serwisu github.com mogą również skorzystać z adresu: https://github.com/bwilczek/vfr-planner/issues
          </Panel.Body>
        </Panel>
        <Panel key={5} eventKey={5}>
          <Panel.Heading>
            <Panel.Title toggle>Umiem programować, czy mogę pomóc w rozwoju serwisu?</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            Jak najbardziej. Kod źródłowy serwisu jest otwarty i dostępny pod adresem https://github.com/bwilczek/vfr-planner
            <br /><br />
            Stworzenie własnego forka i wystawienie pull requesta są mile widziane, jednak zaleca się wcześniejszy kontakt mailowy z autorem.
          </Panel.Body>
        </Panel>
      </PanelGroup>
    )
  }
}
