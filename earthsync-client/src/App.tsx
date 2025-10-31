//import HistoricoPesquisas from "./HistoricoPesquisas";

import { getEvents } from "./services/api/events";
import { useState, useEffect } from "react";
import { EventList } from "./components/organisms/EventList";
import { MapView } from "./pages/initialPage/MapView";
import { EventDetails } from "./pages/eventDetailsPage/EventDetails";
import { FeedPage } from "./pages/feedPage/FeedPage";
import { AboutPage } from "./pages/aboutPage/AboutPage";
import { Navigation } from "./components/molecules/Navigation";
import { GlobalMapOverview } from "./pages/initialPage/GlobalMapOverview";
import { SpaceBackground } from "./components/atoms/SpaceBackground";
import { ResponsiveDemo } from "./components/atoms/ResponsiveDemo";
import { Button } from "./components/atoms/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/atoms/tabs";
import { Toaster } from "./components/atoms/sonner";
import {
  List,
  Map,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Event, SatelliteImage } from "./types/event";

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "map">(
    "list",
  );
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "feed" | "sobre"
  >("dashboard");
  const [view, setView] = useState<"main" | "details">("main");
  const [lastUpdate, setLastUpdate] = useState<Date>(
    new Date(),
  );
  const [currentEventId, setCurrentEventId] = useState<
    string | null
  >(null);

  // fetch events from api
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // getEvents agora faz o trabalho pesado de buscar os detalhes
      const data = await getEvents({ includeImages: true });
      // Isso já está correto:
      setEvents(data.events);
      console.log("DADOS BRUTOS DO 1º EVENTO (APÓS DETALHE):", data.events[0]); // AGORA DEVE TER 'images'
    } catch (error) {
      setEvents([]);
    }
    setLastUpdate(new Date());
    setIsLoading(false);
  };

   // handle hash based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const eventMatch = hash.match(/^#\/evento\/(.+)$/);

      if (eventMatch) {
        const eventId = decodeURIComponent(eventMatch[1]);
        setCurrentEventId(eventId);

        const event = events.find((e) => e.id === eventId);

        if (event) {
          setSelectedEvent(event);
          setView("details");
        } else if (events.length > 0) {
          window.location.hash = "";
          setView("main");
          setCurrentPage("dashboard");
        }
        return;
      }

      if (hash === "#/feed") {
        setCurrentPage("feed");
        setView("main");
        setCurrentEventId(null);
        setSelectedEvent(null);
      } else if (hash === "#/sobre") {
        setCurrentPage("sobre");
        setView("main");
        setCurrentEventId(null);
        setSelectedEvent(null);
      } else {
        setCurrentPage("dashboard");
        setView("main");
        setCurrentEventId(null);
        setSelectedEvent(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () =>
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
  }, [events]);

  // initial fetch and polling
  useEffect(() => {
    fetchEvents();

    // set up polling for real-time updates (every 5 minutes)
    const interval = setInterval(fetchEvents, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // select event
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentEventId(event.id);
    setView("details");
    window.location.hash = `#/evento/${encodeURIComponent(event.id)}`;
  };

  // back to main view
  const handleBackToDashboard = () => {
    setSelectedEvent(null);
    setCurrentEventId(null);
    setView("main");
    const previousPage = currentPage === "feed" ? "#/feed" : "";
    window.location.hash = previousPage;
  };

  // navigate pages
  const handleNavigate = (page: string) => {
    setCurrentPage(page as "dashboard" | "feed" | "sobre");
    setView("main");
    setSelectedEvent(null);
    setCurrentEventId(null);

    const routes = {
      dashboard: "",
      feed: "#/feed",
      sobre: "#/sobre",
    };
    window.location.hash =
      routes[page as keyof typeof routes] || "";
  };

  // select event from map
  const handleMapEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  // switch to full map tab
  const handleViewFullMap = () => {
    setActiveTab("map");
  };

  // render details view
  if (view === "details" && selectedEvent) {
    return (
      <>
        <EventDetails
          event={selectedEvent}
          onBack={handleBackToDashboard}
        />
        <Toaster />
      </>
    );
  }

  const appContent = (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header with Navigation */}
          <header className="mb-8">
            <Navigation
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />

            {/* Status Bar - only show on dashboard */}
            {currentPage === "dashboard" && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-left sm:text-right text-sm">
                      <div className="text-slate-400">
                        Última atualização
                      </div>
                      <div className="text-white">
                        {lastUpdate.toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={fetchEvents}
                      disabled={isLoading}
                      className="bg-[rgba(42,72,137,1)] hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                      />
                      Atualizar
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 mb-6 sm:mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-slate-300 text-sm sm:text-base">
                          Sistema Online
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-300 text-sm sm:text-base">
                          {events.length} eventos ativos
                        </span>
                      </div>

                      <div className="text-slate-400 text-xs sm:text-sm">
                        Cobertura: Últimas 48 horas
                      </div>
                    </div>

                    <div className="text-slate-400 text-xs sm:text-sm">
                      Fonte: NASA EONET API
                    </div>
                  </div>
                </div>
              </>
            )}
          </header>

          {/* Main Content */}
          {currentPage === "dashboard" && (
            <div className="space-y-8">
              {/* Global Map Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <GlobalMapOverview
                    events={events}
                    onEventSelect={handleEventClick}
                    onViewFullMap={handleViewFullMap}
                  />
                </div>

                {/* Quick Stats */}
                <div className="order-1 lg:order-2">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some(
                              (c) => c.title === "Wildfires",
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-red-300">
                        Incêndios
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some(
                              (c) =>
                                c.title === "Severe Storms",
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-blue-300">
                        Tempestades
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some(
                              (c) => c.title === "Earthquakes",
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-yellow-300">
                        Terremotos
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl text-white">
                        {
                          events.filter((e) =>
                            e.categories.some((c) =>
                              [
                                "Floods",
                                "Volcanoes",
                                "Landslides",
                              ].includes(c.title),
                            ),
                          ).length
                        }
                      </div>
                      <div className="text-xs sm:text-sm text-purple-300">
                        Outros
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Events Panel */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value: string) =>
                      setActiveTab(value as "list" | "map")
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
                      <TabsTrigger
                        value="list"
                        className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-slate-700/50"
                      >
                        <List className="w-4 h-4 mr-2" />
                        Lista de Eventos
                      </TabsTrigger>
                      <TabsTrigger
                        value="map"
                        className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-slate-700/50"
                      >
                        <Map className="w-4 h-4 mr-2" />
                        Mapa Global
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="mt-6">
                      <EventList
                        events={events}
                        onEventClick={handleEventClick}
                        isLoading={isLoading}
                      />
                    </TabsContent>

                    <TabsContent value="map" className="mt-6">
                      <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
                        <MapView
                          events={events}
                          selectedEvent={selectedEvent}
                          onEventSelect={handleMapEventSelect}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Recent Activity */}
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                    <h3 className="text-base sm:text-lg text-white mb-3 sm:mb-4">
                      Atividade Recente
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 cursor-pointer hover:border-slate-600/50 transition-colors"
                          onClick={() =>
                            handleEventClick(event)
                          }
                        >
                          <div className="text-white text-sm font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-slate-400 text-xs mt-1">
                            {event.categories[0]?.title} •{" "}
                            {new Date(
                              event.geometry[0]?.date || "",
                            ).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                    <h3 className="text-base sm:text-lg text-white mb-3 sm:mb-4">
                      Informações do Sistema
                    </h3>

                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Frequência de atualização
                        </span>
                        <span className="text-white">
                          5 minutos
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Cobertura temporal
                        </span>
                        <span className="text-white">
                          48 horas
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Precisão GPS
                        </span>
                        <span className="text-white">
                          ±100m
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Status da API
                        </span>
                        <span className="text-green-400">
                          Conectado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed Page */}
          {currentPage === "feed" && (
            <FeedPage
              events={events}
              onEventClick={handleEventClick}
            />
          )}

          {/* About Page */}
          {currentPage === "sobre" && <AboutPage />}
        </div>
      </div>
      <Toaster />
    </div>
  );

  return (
    <>
      {appContent}
      <ResponsiveDemo>{appContent}</ResponsiveDemo>
    </>
  );

}